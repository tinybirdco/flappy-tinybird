const dotenv = require('dotenv');

dotenv.config();

const KAFKA_API_SECRET_CON = process.env.KAFKA_API_SECRET;
const KAFKA_API_KEY_CON = process.env.KAFKA_API_KEY;

module.exports = { KAFKA_API_SECRET_CON, KAFKA_API_KEY_CON };