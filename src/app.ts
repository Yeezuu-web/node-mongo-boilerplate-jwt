import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/userRoutes';
import ErrorMiddleware from './middlewares/errorMiddleware';

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Cookir parser
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Cors - Cros Origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN || '*',
  })
);

app.get('/favico.ico', (req, res) => {
  res.sendStatus(404).end();
});

app.use('/api/v1', UserRoutes);

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  const errorRoute = new Error(`Route ${req.originalUrl} is not found.`) as any;
  errorRoute.statusCode = 404;
  next(errorRoute);
});

app.use(ErrorMiddleware);

export default app;
