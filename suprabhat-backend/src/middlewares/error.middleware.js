import { ApiError } from '../utils/ApiError.js';
import httpStatus from 'http-status';

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (!(err instanceof ApiError)) {
    // Convert other errors to ApiError
    // For example, Zod validation errors
    if (err.name === 'ZodError') {
      statusCode = httpStatus.BAD_REQUEST;
      message = 'Validation failed';
      const errors = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
      return res.status(statusCode).json({
        success: false,
        message,
        errors,
      });
    }
    
    // Log the error for debugging non-ApiError types
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
  });
};

export { errorMiddleware };