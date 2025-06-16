import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';

// Middleware factory for Zod validation
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // ZodError will be caught by the global error handler
    next(error);
  }
};

export default validate;