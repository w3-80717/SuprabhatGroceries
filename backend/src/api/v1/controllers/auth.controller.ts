// src/api/v1/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { authService, RegisterUserDto, LoginUserDto } from '../../../core/services/auth.service'; // Adjust path
import { RegisterUserInput, LoginUserInput } from '../validators/auth.validator'; // Types for validated input

export class AuthController {
  async register(req: Request<unknown, unknown, RegisterUserInput>, res: Response, next: NextFunction) {
    try {
      const userData: RegisterUserDto = req.body; // req.body is now typed by validation middleware
      const result = await authService.registerUser(userData);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }

  async login(req: Request<unknown, unknown, LoginUserInput>, res: Response, next: NextFunction) {
    try {
      const loginData: LoginUserDto = req.body; // req.body is typed
      const result = await authService.loginUser(loginData);
      res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Example: Get current user (requires auth middleware later)
  // async getMe(req: Request, res: Response, next: NextFunction) {
  //   // Assuming auth middleware attaches user to req.user
  //   // const userId = (req as any).user?.id;
  //   // if (!userId) return next(new UnauthorizedError('Not authenticated'));
  //   // try {
  //   //   const user = await userService.findUserById(userId);
  //   //   if (!user) return next(new NotFoundError('User not found'));
  //   //   res.status(200).json({ status: 'success', data: user });
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // }
}

export const authController = new AuthController();