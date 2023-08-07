import { EVENTS_URL, TINYBIRD_TOKEN } from "../config";

export async function send_session_data(session) {
    const payload = {
        session_id: session.id,
        name: session.name,
        timestamp: Date.now(),
    };
    return send_data_to_tinybird("sessions", payload);
}

export async function send_death(session, score) {
    if (!TINYBIRD_TOKEN) return;

    const payload = {
        session_id: session.id,
        name: session.name,
        score: score,
        timestamp: Date.now(),
    };
    return send_data_to_tinybird("deaths", payload);
}

export async function send_data_to_tinybird(name, payload) {
    if (!TINYBIRD_TOKEN) return;

    return fetch(`${EVENTS_URL}?name=${name}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${TINYBIRD_TOKEN}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
}

export async function get_data_from_tinybird(url) {
    if (!TINYBIRD_TOKEN) return;

    return fetch(url, {
        headers: {
            Authorization: `Bearer ${TINYBIRD_TOKEN}`,
        },
    })
        .then((r) => r.json())
        .catch((e) => e.toString());
}
