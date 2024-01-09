import express from 'express';
import { Kafka } from 'kafkajs';
import cors from 'cors';

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER_URL],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_API_SECRET,
    },
});

const producer = kafka.producer();
const app = express();

app.use(express.json());
app.use(cors());    

app.post('/api/send-kafka', async (req, res) => {
    const payload = req.body;
    const topic = 'demo_flappy';

    try {
        await producer.connect();
        await producer.send({
            topic,
            messages: [
                { key: 'vercel_edge', value: JSON.stringify(payload) },
            ],
        });

        res.json({ status: 'Message sent to Kafka' });
    } catch (error) {
        console.error('Error sending message to Kafka:', error);
        res.json({ error: error.message });
    } finally {
        await producer.disconnect();
    }
});

module.exports = app; // Export the app object