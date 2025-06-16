import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config/index.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    // phone: { type: String, unique: true, sparse: true }, // Uncomment if you use phone
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
      phone: {
      type: String,
      // You can add unique, sparse, and validation as needed
      // e.g., match: [/^\+91[1-9][0-9]{9}$/, 'is invalid']
    },
    // Other fields from SRS
    addresses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address' // A separate model for addresses is better practice
    }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate JWT
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiration }
  );
};

// Method to remove password from the returned object
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
}


const User = mongoose.model('User', userSchema);
export default User;