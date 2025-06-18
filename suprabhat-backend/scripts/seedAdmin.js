// scripts/seedAdmin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// --- IMPORTANT ---
// Since this script is outside the 'src' folder which is configured
// for ES Modules, we need to adjust the import paths.
// We also need to specify the file extension `.js`.
import User from '../src/api/v1/users/user.model.js';

// --- Configuration ---
// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// --- Admin User Details ---
// It's best practice to get these from environment variables too,
// especially the password, but we'll hardcode for simplicity here.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@suprabhat.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPassword123';
const ADMIN_NAME = 'Suprabhat Admin';

// --- Main Seeder Function ---
const seedAdminUser = async () => {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in your .env file.');
    process.exit(1);
  }

  console.log('Connecting to the database...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully.');

    // 1. Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists. No action taken.`);
      return;
    }

    // 2. If not, create the new admin user
    console.log('Admin user not found. Creating a new one...');

    // We have to hash the password manually here because we are not using
    // the 'save' middleware from the User model directly in a way that triggers it.
    // Creating the user directly is safer. The pre-save hook WILL run with .create()
    const newUser = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // The pre-save hook will hash this
      role: 'admin',
    };

    await User.create(newUser);

    console.log('-------------------------------------------');
    console.log('🎉 Admin user created successfully! 🎉');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('-------------------------------------------');

  } catch (error) {
    console.error('An error occurred during the seeding process:');
    console.error(error);
    process.exit(1);
  } finally {
    // 3. Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// --- Run the Script ---
seedAdminUser();