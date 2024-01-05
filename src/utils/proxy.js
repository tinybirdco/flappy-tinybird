import { KAFKA_API_SECRET_CON, KAFKA_API_KEY_CON } from "../confluentConfig.js";
import http from 'http';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'demo_flappy',
    brokers: ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'], // Replace with your Kafka broker list
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: KAFKA_API_KEY_CON,
        password: KAFKA_API_SECRET_CON,
    },
});

const producer = kafka.producer();

http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'POST' && req.url === '/sendToKafka') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const payload = JSON.parse(body);

            const topic = 'demo_flappy';

            try {
                await producer.connect();
                await producer.send({
                    topic,
                    messages: [
                        { key: 'dev_jk', value: JSON.stringify(payload) },
                    ],
                });

                res.end(JSON.stringify({ status: 'Message sent to Kafka' }));
            } catch (error) {
                console.error('Error sending message to Kafka:', error);
                res.end(JSON.stringify({ error: error.message }));
            } finally {
                await producer.disconnect();
            }
        });
    } else {
        res.end('Invalid request');
    }
}).listen(3000);
