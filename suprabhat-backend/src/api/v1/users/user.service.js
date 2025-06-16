import httpStatus from 'http-status';
import User from './user.model.js';
import { ApiError } from '../../../utils/ApiError.js';

/**
 * Get user by ID
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

export const userService = {
  getUserById,
};