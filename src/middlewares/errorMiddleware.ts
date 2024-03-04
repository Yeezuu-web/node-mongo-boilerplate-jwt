import ErrorHandler from '@/configs/errorHandler';

import { Request, Response, NextFunction } from 'express';

const ErrorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Internal Server Error';

  // Handle specific error cases
  switch (error.name) {
    case 'CastError': // Wrong MongoDB ID format
      error = new ErrorHandler('Resource not found.', 400);
      break;
    case 11000: // Duplicate key error (MongoDB)
      const duplicatedField = Object.keys(error.keyValue)[0];
      error = new ErrorHandler(`Duplicate ${duplicatedField} entered.`, 400);
      break;
    case 'JsonWebTokenError': // Wrong JWT
      error = new ErrorHandler('Json web token is invalid. Try again.', 401);
      break;
    case 'TokenExpiredError': // JWT expired
      error = new ErrorHandler(
        'Your session has been expired. Please login again.',
        401
      );
      break;
    default:
      // Log the error for debugging purposes
      console.error(error);
  }

  // Respond with the error message and status code
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

export default ErrorMiddleware;
