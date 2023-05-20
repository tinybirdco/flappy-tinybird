const events_url = "https://api.tinybird.co/v0/events?name=scores";

export async function send_score(session) {
  const response = await fetch(events_url, {
    method: "POST",
    body: JSON.stringify({
      session_id: session.id,
      name: session.name,
      email: session.email,
    }),
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TINYBIRD_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}
