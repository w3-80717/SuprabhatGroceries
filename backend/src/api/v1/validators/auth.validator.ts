// src/api/v1/validators/auth.validator.ts
import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
    email: z.string().email('Invalid email address').optional(), // Optional
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'), // Mandatory
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    // role: z.enum(['user', 'admin']).optional(), // If you want to allow role specification
  }).refine(data => data.email || data.phone, { // Ensure at least one is provided
    message: "Either email or phone must be provided",
    // path: ["email"], // You can specify a path for the error if needed
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    loginId: z.string().min(1, 'Login ID (email or phone) is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Type interfaces for validated data (optional, Zod infers them)
export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];