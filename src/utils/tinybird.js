import { EVENTS_URL, TINYBIRD_TOKEN } from "../config";

export async function send_session_data(session) {
    if (!TINYBIRD_TOKEN) return;

    const payload = {
        session_id: session.id,
        name: session.name,
        timestamp: new Date().toISOString(),
        type: "score",

    };
    return send_data_to_tinybird("events_api", payload);
}

export async function send_death(session) {
    if (!TINYBIRD_TOKEN) return;

    const payload_death = {
        session_id: session.id,
        name: session.name,
        timestamp: new Date().toISOString(),
        type: "game_over",
    };
    return send_data_to_tinybird("events_api", payload_death);
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
