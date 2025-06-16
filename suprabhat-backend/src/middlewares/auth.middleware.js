import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import config from '../config/index.js';
import User from '../api/v1/users/user.model.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access token is missing');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }
});