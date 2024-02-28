import { EVENTS_URL, TINYBIRD_READ_TOKEN, TINYBIRD_APPEND_TOKEN } from "../config";

export async function send_data_to_tinybird(payload) {
    if (!TINYBIRD_READ_TOKEN) return;

    return fetch(`${EVENTS_URL}?name=events_api`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${TINYBIRD_APPEND_TOKEN}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
}

export async function sendToKafka(payload) {
    console.log('Sending data to Kafka:', payload);

    return fetch('http://localhost:3000/sendToKafka', {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        // .then((data) => console.log('Data sent to Kafka:', data))
        .catch((error) => console.log('Error sending data to Kafka:', error));
}

export async function get_data_from_tinybird(url) {
    if (!TINYBIRD_READ_TOKEN) return;

    return fetch(url, {
        headers: {
            Authorization: `Bearer ${TINYBIRD_READ_TOKEN}`,
        },
    })
        .then((r) => r.json())
        .catch((e) => e.toString());
}

export async function send_session_data(session) {
    if (!TINYBIRD_APPEND_TOKEN) return;

    const payload = {
        session_id: session.id,
        name: session.name,
        timestamp: new Date().toISOString(),
        type: "score",

    };
    return sendToKafka(payload);
    // return send_data_to_tinybird(payload);
}

export async function send_death(session) {
    if (!TINYBIRD_READ_TOKEN) return;

    const payload = {
        session_id: session.id,
        name: session.name,
        timestamp: new Date().toISOString(),
        type: "game_over",
    };
    return sendToKafka(payload);
    // return send_data_to_tinybird(payload);
}

export async function send_purchase(session) {
    if (!TINYBIRD_READ_TOKEN) return;

    const payload = {
        session_id: session.id,
        name: session.name,
        timestamp: new Date().toISOString(),
        type: "purchase",
    };
    return sendToKafka(payload);
    // return send_data_to_tinybird(payload);
}