import dotenv from 'dotenv';
import path from 'path';

export const loadEnv = (): void => {
  // Determine the environment (default to development if not set)
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = `.env.${nodeEnv}`; // e.g., .env.development, .env.production

  // Construct the path to the .env file in the root of the 'backend' directory
  const envPath = path.resolve(process.cwd(), envFile);

  const result = dotenv.config({ path: envPath });

  if (result.error && nodeEnv !== 'production') {
    // In production, env vars might be set directly in the hosting environment
    console.warn(
      `Warning: Could not find ${envFile} file at ${envPath}. Using system environment variables or defaults.`
    );
  }

  // Optional: Check for essential environment variables and exit if not found
  if (!process.env.DATABASE_URL) {
    console.error('FATAL ERROR: DATABASE_URL is not defined.');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
   console.error('FATAL ERROR: JWT_SECRET is not defined.');
   process.exit(1);
  }
};