import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/errors'; // Adjust path as needed
import { logger } from '../utils/logger';   // Adjust path as needed

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error | ApiError | mongoose.Error.ValidationError | any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => { // Changed return to void as res.status().json() doesn't return a Response object for the middleware type
  logger.error(err.message || 'An error occurred', err);

  let statusCode = 500;
  let message = 'An unexpected internal server error occurred.';
  let stack = process.env.NODE_ENV !== 'production' ? err.stack : undefined;

if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      // If err.message is an array of validation errors from Zod
      ...(Array.isArray((err as any).details) && { errors: (err as any).details }),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
    return;
  }
 else if (err.name === 'ValidationError' && err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Invalid input data. ${errors.join('. ')}`;
    statusCode = 400;
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate field value: ${field} ('${value}'). Please use another value.`;
    statusCode = 409;
  } else if (err.name === 'CastError' && err instanceof mongoose.Error.CastError) {
    message = `Invalid ${err.path}: ${err.value}. Resource not found with this ID.`;
    statusCode = 400;
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(stack && { stack: stack }),
  });
};