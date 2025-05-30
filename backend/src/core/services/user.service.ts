// src/core/services/user.service.ts
import UserModel, { IUser } from '../../models/User.model';
import { ConflictError, NotFoundError } from '../../utils/errors';
import mongoose from 'mongoose'; // Ensure mongoose is imported

export type UserResponse = {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'user' | 'admin';
  addresses: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Define a more specific type for the Mongoose document input to toUserResponse
// This clarifies that _id is an ObjectId on the document itself.
type MongooseUserDocument = IUser & { _id: mongoose.Types.ObjectId; addresses: mongoose.Types.ObjectId[] };


export class UserService {
  async findUserByEmail(email: string): Promise<IUser | null> { // Returns full IUser document
    return UserModel.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('+password');
  }

  async findUserByPhone(phone: string): Promise<IUser | null> { // Returns full IUser document
    return UserModel.findOne({ phone }).select('+password');
  }

  // Helper to convert Mongoose User document to UserResponse
  private toUserResponse(userDoc: MongooseUserDocument): UserResponse {
    return {
      _id: userDoc._id.toString(), // ObjectId to string
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      addresses: userDoc.addresses.map(addr => addr.toString()), // ObjectIds to strings
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }

  async findUserById(id: string): Promise<UserResponse | null> {
    // Fetching as a Mongoose document, not lean, to ensure _id typing is more reliable here.
    // If you use .lean(), you need to be careful with how Mongoose types _id.
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    // userDoc._id is an ObjectId here
    return this.toUserResponse(userDoc as MongooseUserDocument);
  }

  async createUser(userData: Partial<IUser>): Promise<UserResponse> {
    if (userData.email) {
        const existingEmailUser = await UserModel.findOne({ email: userData.email });
        if (existingEmailUser) {
            throw new ConflictError(`User with email ${userData.email} already exists.`);
        }
    }
    if (userData.phone) {
        const existingPhoneUser = await UserModel.findOne({ phone: userData.phone });
        if (existingPhoneUser) {
            throw new ConflictError(`User with phone ${userData.phone} already exists.`);
        }
    }

    const userDocInstance = new UserModel(userData);
    await userDocInstance.save();

    // After save, userDocInstance._id is an ObjectId
    return this.toUserResponse(userDocInstance as MongooseUserDocument);
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<UserResponse | null> {
    const userToUpdate = await UserModel.findById(id);
    if (!userToUpdate) throw new NotFoundError('User not found');

    if (updateData.password && typeof updateData.password === 'string') {
        userToUpdate.password = updateData.password;
    }
    Object.keys(updateData).forEach(key => {
        if (key !== 'password' && key !== '_id' && key in userToUpdate) {
            (userToUpdate as any)[key] = (updateData as any)[key];
        }
    });

    await userToUpdate.save({ validateModifiedOnly: true });

    return this.toUserResponse(userToUpdate as MongooseUserDocument);
  }
}

export const userService = new UserService();