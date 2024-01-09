const defaultOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

function isOriginAllowed(origin, allowed) {
    return Array.isArray(allowed)
        ? allowed.some((o) => isOriginAllowed(origin, o))
        : typeof allowed === "string"
        ? origin === allowed
        : allowed instanceof RegExp
        ? allowed.test(origin)
        : !!allowed;
}

function getOriginHeaders(reqOrigin, origin) {
    const headers = new Headers();

    if (origin === "*") {
        // Allow any origin
        headers.set("Access-Control-Allow-Origin", "*");
    } else if (typeof origin === "string") {
        // Fixed origin
        headers.set("Access-Control-Allow-Origin", origin);
        headers.append("Vary", "Origin");
    } else {
        const allowed = isOriginAllowed(reqOrigin ?? "", origin);

        if (allowed && reqOrigin) {
            headers.set("Access-Control-Allow-Origin", reqOrigin);
        }
        headers.append("Vary", "Origin");
    }

    return headers;
}

// originHeadersFromReq

async function originHeadersFromReq(req, origin) {
    const reqOrigin = req.headers.get("Origin") || undefined;
    const value =
        typeof origin === "function" ? await origin(reqOrigin, req) : origin;

    if (!value) return;
    return getOriginHeaders(reqOrigin, value);
}

function getAllowedHeaders(req, allowed) {
    const headers = new Headers();

    if (!allowed) {
        allowed = req.headers.get("Access-Control-Request-Headers");
        headers.append("Vary", "Access-Control-Request-Headers");
    } else if (Array.isArray(allowed)) {
        // If the allowed headers is an array, turn it into a string
        allowed = allowed.join(",");
    }
    if (allowed) {
        headers.set("Access-Control-Allow-Headers", allowed);
    }

    return headers;
}

export default async function cors(req, res, options) {
    const opts = { ...defaultOptions, ...options };
    const { headers } = res;
    const originHeaders = await originHeadersFromReq(req, opts.origin ?? false);
    const mergeHeaders = (v, k) => {
        if (k === "Vary") headers.append(k, v);
        else headers.set(k, v);
    };

    // If there's no origin we won't touch the response
    if (!originHeaders) return res;

    originHeaders.forEach(mergeHeaders);

    if (opts.credentials) {
        headers.set("Access-Control-Allow-Credentials", "true");
    }

    const exposed = Array.isArray(opts.exposedHeaders)
        ? opts.exposedHeaders.join(",")
        : opts.exposedHeaders;

    if (exposed) {
        headers.set("Access-Control-Expose-Headers", exposed);
    }

    // Handle the preflight request
    if (req.method === "OPTIONS") {
        if (opts.methods) {
            const methods = Array.isArray(opts.methods)
                ? opts.methods.join(",")
                : opts.methods;

            headers.set("Access-Control-Allow-Methods", methods);
        }

        getAllowedHeaders(req, opts.allowedHeaders).forEach(mergeHeaders);

        if (typeof opts.maxAge === "number") {
            headers.set("Access-Control-Max-Age", String(opts.maxAge));
        }

        if (opts.preflightContinue) return res;

        headers.set("Content-Length", "0");
        return new Response(null, {
            status: opts.optionsSuccessStatus,
            headers,
        });
    }

    // If we got here, it's a normal request
    return res;
}
