import { Kafka } from "kafkajs";
import cors from "./cors";

export const config = {
    runtime: "edge",
};

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER_URL],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET,
    },
});

const producer = kafka.producer();

export default async function handler(req) {
    const payload = req.body;
    const topic = "demo_flappy";

    try {
        await producer.connect();
        await producer.send({
            topic,
            messages: [{ key: "vercel_edge", value: JSON.stringify(payload) }],
        });
        await producer.disconnect();
        return cors(
            req,
            new Response(JSON.stringify({ status: "Message sent to Kafka" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );
    } catch (error) {
        await producer.disconnect();
        return cors(
            req,
            new Response(
                JSON.stringify({ status: "Error sending message to Kafka" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            )
        );
    }
}
