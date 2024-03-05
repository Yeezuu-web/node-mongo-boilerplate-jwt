import express, { Express, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import UserRoutes from './routes/userRoutes';
import ErrorMiddleware from './middlewares/errorMiddleware';
import healthRoutes from './routes/healthRoutes';

dotenv.config();

const app: Express = express();

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));

// Cookir parser
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Cors - Cros Origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN || '*',
    credentials: true,
  })
);

app.get('/favico.ico', (req: Request, res: Response) => {
  res.sendStatus(404).end();
});

app.use('/api/v1', UserRoutes);
app.use('/', healthRoutes);

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  const errorRoute = new Error(`Route ${req.originalUrl} is not found.`) as any;
  errorRoute.statusCode = 404;
  next(errorRoute);
});

app.use(ErrorMiddleware);

export default app;
