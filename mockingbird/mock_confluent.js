import { ConfluentCloudKafkaGenerator } from "@tinybirdco/mockingbird";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const cfltRestEndpoint = process.env.CFLT_REST_ENDPOINT
const cfltClusterId = process.env.CFLT_CLUSTER_ID
const cfltTopic = process.env.CFLT_TOPIC
const cfltApiKey = process.env.CFLT_API_KEY
const cfltApiSecret = process.env.CFLT_API_SECRET

const schema = {
    session_id: {
        type: 'mockingbird.pick',
        params: [
            {
                values: [
                    'f1ec24d7-6b1b-4d08-b20c-4dade42dfe8d',
                    '8c5d8191-4d2f-46e1-bb70-e0d79366d105',
                    '6a95a70a-1dd3-4b6f-b2cf-6651d4a6e079',
                    'bc513215-521b-4cfb-865d-7e6c150b7ec3',
                    '9d4a7d3a-2f94-4a55-9f32-d303b88e8f7a',
                    '3c8d6b6b-e63c-4311-9e5d-b1e9e77a4f22',
                    '7fb2de88-01f3-4467-9bf4-3d1b4d8f9f80',
                    '5c4a7ce2-8ed7-4e32-b791-5f8377b0d4d3',
                    'c576875d-5879-4bfc-b548-38b2d95f6d5b',
                    '1f2c8bcf-8a5b-4eb1-90bf-8726e63d81b7',
                    'aefffc0a-915b-4b72-b065-431cc6712d2f',
                    '68a798bb-11d7-4c9a-a3e8-2f1cf9818835',
                    '41d9f0a2-bb0f-4a4b-84c0-dc02adce7633',
                    '2e7e8d94-049e-4ac8-9d7b-7e5c74a7c865',
                    '9c015af7-e16d-4f17-881e-2a33c0c073b7'
                ]
            }
        ]
    },
    name: {
        type: 'person.firstName'
    },
    timestamp: {
        type: 'mockingbird.timestampNow'
    },
    type: {
        type: 'mockingbird.pickWeighted',
        params: [
            {
                values: [
                    'score',
                    'game_over',
                    'purchase'
                ],
                weights: [
                    70,
                    20,
                    10
                ]
            }
        ]
    }
};

const tbGenerator = new ConfluentCloudKafkaGenerator({
    schema,
    restEndpoint: cfltRestEndpoint,
    clusterId: cfltClusterId,
    topic: cfltTopic,
    apiKey: cfltApiKey,
    apiSecret: cfltApiSecret,
    eps: 500,
    limit: 1000000,
});

async function run() {
    console.log(`Streaming data to Confluent Cloud...`);
    await tbGenerator.generate();
}

run()