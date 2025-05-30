// src/models/User.model.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose'; // Import Types

// Interface for User document (represents a single document in MongoDB)
export interface IUser extends Document<Types.ObjectId> { // <--- HERE
  _id: Types.ObjectId; // Explicitly define _id type for clarity, though Document<Types.ObjectId> implies it
  name: string;
  email?: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  addresses: Types.ObjectId[]; // Array of Address ObjectIds
  createdAt: Date; // Provided by timestamps: true
  updatedAt: Date; // Provided by timestamps: true
  // Method to compare passwords (optional, can also be a utility function)
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model (for static methods, if any)
// The generic T in Model<T> should be IUser
// The second generic (QueryHelpers) and third (Methods) are optional
export interface IUserModel extends Model<IUser> {
  // Define static methods here if needed
  // e.g., findByEmailOrPhone(emailOrPhone: string): Promise<IUser | null>;
}

const UserSchema: Schema<IUser, IUserModel> = new Schema( // Pass IUser to Schema generic
  {
    // _id is automatically created by Mongoose, but defining it in the interface is good.
    // No need to define _id in the Schema fields object itself unless you want to customize it.
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    // ... rest of your schema definition ...
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address if provided',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    addresses: [ // This defines the type for Mongoose/MongoDB
      {
        type: Types.ObjectId, // Use Types.ObjectId here
        ref: 'Address',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ... pre-save hook and methods ...
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  // 'this.password' refers to the hashed password on the document.
  // It should be available if the document was fetched with +password or if this method is called on a new doc being saved.
  return bcrypt.compare(candidatePassword, this.password);
};


const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default UserModel;