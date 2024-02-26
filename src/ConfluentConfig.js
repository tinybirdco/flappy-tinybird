import dotenv from 'dotenv';

dotenv.config();

export const KAFKA_API_SECRET_CON = process.env.KAFKA_API_SECRET;
export const KAFKA_API_KEY_CON = process.env.KAFKA_API_KEY;