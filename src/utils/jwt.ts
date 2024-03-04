import { IUser } from '@/models/userModel';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import { redis } from './redis';
dotenv.config();

interface ITokenOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Redis store user_id
  redis.set(user._id, JSON.stringify(user) as any);

  const accessTokenExpires = parseInt(
    process.env.ACCESS_TOKEN_EXP || '300',
    10
  );

  const refreshTokenExpires = parseInt(
    process.env.REFRESH_TOKEN_EXP || '1200',
    10
  );

  const accessTokenOptions: ITokenOption = {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    maxAge: refreshTokenExpires,
    httpOnly: true,
    sameSite: 'lax',
  };

  const refreshTokenOptions: ITokenOption = {
    expires: new Date(Date.now() + refreshTokenExpires * 1000),
    maxAge: refreshTokenExpires,
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true;
  }

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
