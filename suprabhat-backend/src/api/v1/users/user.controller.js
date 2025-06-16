import httpStatus from 'http-status';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiResponse } from '../../../utils/ApiResponse.js';
import { userService } from './user.service.js';

const getMyProfile = asyncHandler(async (req, res) => {
  // The user object is attached by the authMiddleware
  const user = await userService.getUserById(req.user._id);
  res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, user, 'User profile fetched successfully')
  );
});

export const userController = {
  getMyProfile,
};