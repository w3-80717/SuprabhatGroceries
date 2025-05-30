// src/utils/jwt.util.ts
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
// No longer need mongoose here if we pass string id
// import mongoose from 'mongoose';

const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN_DURATION: string = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET_KEY) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

export interface JwtPayload {
  id: string; // User ID
  // role?: 'user' | 'admin'; // Optional: if you decide to include role
}

// No longer need UserForToken interface here

// generateToken now accepts the string ID and optionally the role
export const generateToken = (userId: string /*, userRole?: 'user' | 'admin' */): string => {
  const payload: JwtPayload = {
    id: userId,
    // ...(userRole && { role: userRole }),
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN_DURATION as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};