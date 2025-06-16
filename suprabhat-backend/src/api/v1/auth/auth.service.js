import httpStatus from 'http-status';
import User from '../users/user.model.js';
import { ApiError } from '../../../utils/ApiError.js';

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const registerUser = async (userData) => {
  if (await User.findOne({ email: userData.email })) {
    throw new ApiError(httpStatus.CONFLICT, 'User with this email already exists.');
  }
  
  const user = await User.create(userData);
  const token = user.generateAccessToken();

  return { user, token };
};

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  
  const token = user.generateAccessToken();
  
  // Convert to object to remove password before returning
  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, token };
};

export const authService = {
  registerUser,
  loginUser,
};