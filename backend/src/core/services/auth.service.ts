// src/core/services/auth.service.ts
import { userService, UserResponse } from './user.service';
import { IUser } from '../../models/User.model';
import { comparePassword } from '../../utils/hash.util';
import { generateToken } from '../../utils/jwt.util'; // JwtPayload no longer needed here if not used
import { UnauthorizedError, ConflictError, BadRequestError } from '../../utils/errors';
import mongoose from 'mongoose'; // Keep for IUser._id access if needed temporarily

export interface RegisterUserDto {
  name: string;
  email?: string;
  phone: string;
  password: string;
}

export interface LoginUserDto {
  loginId: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export class AuthService {
  constructor(private uService: typeof userService) {}

  async registerUser(userData: RegisterUserDto): Promise<AuthResponse> {
    const { name, email, phone, password } = userData;

    if (email) {
        const existingEmailUser = await this.uService.findUserByEmail(email); // This returns IUser | null
        if (existingEmailUser) {
            throw new ConflictError(`User with email ${email} already exists.`);
        }
    }
    const existingPhoneUser = await this.uService.findUserByPhone(phone); // This returns IUser | null
    if (existingPhoneUser) {
        throw new ConflictError(`User with phone ${phone} already exists.`);
    }

    const newUserInput: Partial<IUser> = { name, phone, password };
    if (email) {
      newUserInput.email = email;
    }

    // userService.createUser now returns UserResponse, which has _id as string
    const createdUserResponse = await this.uService.createUser(newUserInput);

    // Pass the string _id from UserResponse
    const token = generateToken(createdUserResponse._id /*, createdUserResponse.role */);

    return { user: createdUserResponse, token };
  }

  async loginUser(loginData: LoginUserDto): Promise<AuthResponse> {
    const { loginId, password } = loginData;

    if (!loginId || !password) {
        throw new BadRequestError('Login ID and password are required.');
    }

    let userDoc: IUser | null = null; // This will be the Mongoose document
    if (loginId.includes('@')) {
        userDoc = await this.uService.findUserByEmail(loginId);
    } else {
        userDoc = await this.uService.findUserByPhone(loginId);
    }

    if (!userDoc) {
      throw new UnauthorizedError('Invalid credentials - user not found.');
    }

    // userDoc.password will be the hashed password
    const isPasswordMatch = await comparePassword(password, userDoc.password!);
    if (!isPasswordMatch) {
      throw new UnauthorizedError('Invalid credentials - password mismatch.');
    }

    // userDoc._id here is mongoose.Types.ObjectId
    // We need its string representation for the token and the UserResponse
    const userIdString = (userDoc._id as mongoose.Types.ObjectId).toString();

    const token = generateToken(userIdString /*, userDoc.role */);

    // Construct UserResponse DTO
    const userResponse: UserResponse = {
        _id: userIdString,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        role: userDoc.role,
        addresses: userDoc.addresses ? userDoc.addresses.map(addr => (addr as mongoose.Types.ObjectId).toString()) : [],
        createdAt: userDoc.createdAt,
        updatedAt: userDoc.updatedAt,
    };

    return { user: userResponse, token };
  }
}

export const authService = new AuthService(userService);