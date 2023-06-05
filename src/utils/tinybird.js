const events_url = "https://api.tinybird.co/v0/events?name=";

export async function send_score(session, score) {
    const payload = {
        session_id: session.id,
        name: session.name,
        email: session.email,
        score: score,
        timestamp: Date.now(),
    }
    return send_data_to_tinybird('scores', payload)
}

export async function send_death(session, score) {
    const payload = {
        session_id: session.id,
        name: session.name,
        email: session.email,
        score: score,
        timestamp: Date.now(),
    }
    return send_data_to_tinybird('deaths', payload)
}

export async function send_data_to_tinybird(name, payload) {
    return fetch(events_url + name, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TINYBIRD_TOKEN}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
}

export async function get_data_from_tinybird(url, token) {
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TINYBIRD_TOKEN}`,
        }
    })
        .then(r => r.json())
        .catch(e => e.toString())
}
