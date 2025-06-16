import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongodbUri);
    console.log(`\n☘️  MongoDB Connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection FAILED', error);
    process.exit(1);
  }
};

export default connectDB;