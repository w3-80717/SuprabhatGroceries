import httpStatus from 'http-status';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { authService } from './auth.service.js';

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  res.status(httpStatus.CREATED).json(
    new ApiResponse(httpStatus.CREATED, { user, token }, 'User registered successfully')
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { user, token }, 'Login successful')
  );
});

export const authController = {
  register,
  login,
};