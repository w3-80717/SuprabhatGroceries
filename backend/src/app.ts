import express, { Application, Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from './middlewares/errorHandler.middleware'; // Import it
import { NotFoundError } from './utils/errors';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { apiV1Router } from './api/v1/routes'; // Import the main v1 router
const app: Application = express();

// --- Core Middlewares ---
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS - configure origins as needed for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Backend is healthy!' });
});

app.use('/api/v1', apiV1Router);


// --- 404 Handler ---
// This should be after all your API routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
});

// --- Global Error Handler (must be the last middleware) ---
app.use(globalErrorHandler); // Use the imported handler

export default app;