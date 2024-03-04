import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import ErrorHandler from '@/configs/errorHandler';
import { redis } from '@/utils/redis';
import CatchAsyncMiddleware from './catchAsyncMiddleware';
import { RedisKey } from 'ioredis';

dotenv.config();

function extractToken(authorizationHeader: string): string | null {
  if (authorizationHeader.startsWith('Bearer ')) {
    const parts = authorizationHeader.split(' ');

    if (parts.length === 2) {
      return parts[1];
    }
  }
  return null;
}

const isAuthenticated = CatchAsyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    // const access_token = extractToken(req.headers.authorization as string);

    if (!access_token) {
      throw new ErrorHandler('Unautheticated', 401);
    }

    const deconde = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as JwtPayload;

    console.log(deconde);

    const user = await redis.get(deconde.sub as RedisKey);

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    (req as any).user = JSON.parse(user!);

    next();
  }
);

export default isAuthenticated;
