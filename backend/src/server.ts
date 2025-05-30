import app from './app';
import { loadEnv } from './config';
import connectDB from './config/database.config'; // Import connectDB
import { logger } from './utils/logger'; // Import logger

const startServer = async () => {
  // Load environment variables first
  loadEnv();

  // Connect to Database
  await connectDB(); // Call connectDB

  const PORT = process.env.PORT || 5001;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  app.listen(PORT, () => {
    logger.info(`Backend server is running on http://localhost:${PORT}`);
    logger.info(`Current Environment: ${NODE_ENV}`);
  });
};

startServer().catch(error => {
  logger.error('Failed to start the server:', error);
  process.exit(1);
});