import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';

// This middleware must run AFTER authMiddleware
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden: Access is restricted to administrators.');
};