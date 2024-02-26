const dotenv = require('dotenv');

dotenv.config();

const KAFKA_API_SECRET_CON = process.env.KAFKA_API_SECRET;
const KAFKA_API_KEY_CON = process.env.KAFKA_API_KEY;
const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL;
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;

module.exports = { KAFKA_API_SECRET_CON, KAFKA_API_KEY_CON, KAFKA_CLIENT_ID, KAFKA_BROKER_URL };