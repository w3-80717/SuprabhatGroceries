import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import apiV1Router from './api/v1/index.js';

const app = express();

// Middlewares
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(morgan('dev')); // Logger

// API Routes
app.get('/healthcheck', (req, res) => res.status(200).send('OK'));
app.use('/api/v1', apiV1Router);

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;