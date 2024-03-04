import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis is connected.`);
    return process.env.REDIS_URL;
  }
  throw new Error('No REDIS_URL provided');
};

export const redis = new Redis(redisClient());
