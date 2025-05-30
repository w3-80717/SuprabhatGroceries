import mongoose from 'mongoose';
import { logger } from '../utils/logger'; // You'll create this logger utility

const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      logger.error('MONGODB_URI not defined in environment variables.');
      process.exit(1); // Exit process with failure
    }

    await mongoose.connect(dbUri);
    // mongoose.set('debug', process.env.NODE_ENV === 'development'); // Optional: Mongoose debug logging

    logger.info('MongoDB Connected successfully.');

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });

  } catch (error) {
    if (error instanceof Error) {
      logger.error(`MongoDB connection error: ${error.message}`);
    } else {
      logger.error('An unknown error occurred during MongoDB connection.');
    }
    process.exit(1);
  }
};

export default connectDB;