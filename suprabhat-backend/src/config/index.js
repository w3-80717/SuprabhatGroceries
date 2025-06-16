import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
  port: process.env.PORT || 8000,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  },
  corsOrigin: process.env.CORS_ORIGIN,
};

export default config;