const express = require('express');
const { Kafka } = require('kafkajs');
const { KAFKA_API_SECRET_CON, KAFKA_API_KEY_CON, KAFKA_BROKER_URL, KAFKA_CLIENT_ID } = require("./confluentConfig.js");
const cors = require('cors');

const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER_URL],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: KAFKA_API_KEY_CON,
        password: KAFKA_API_SECRET_CON,
    },
});

const producer = kafka.producer();
const app = express();

app.use(express.json());
app.use(cors());

app.post('/sendToKafka', async (req, res) => {
    const payload = req.body;
    const topic = 'demo_flappy';

    console.log(payload)

    try {
        await producer.connect();
        await producer.send({
            topic,
            messages: [
                { key: 'dev_jk', value: JSON.stringify(payload) },
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

app.listen(3000, () => {
    console.log('Kafka microservice running on port 3000');
});