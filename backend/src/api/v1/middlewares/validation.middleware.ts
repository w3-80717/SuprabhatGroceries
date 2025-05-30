// src/api/v1/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../../../utils/errors'; // Adjust path

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for a cleaner response
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
        }));
        // Pass a new BadRequestError with formatted messages to the global error handler
        return next(new BadRequestError('Invalid request data', errorMessages ));
      }
      // For other unexpected errors during validation
      return next(new BadRequestError('Invalid request data'));
    }
  };