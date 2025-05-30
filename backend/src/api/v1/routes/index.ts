// src/api/v1/routes/index.ts
import { Router } from 'express';
import { authRouter } from './auth.routes';
// Import other routers as you create them
// import { productRouter } from './product.routes';

const router = Router();

router.use('/auth', authRouter);
// router.use('/products', productRouter);

// A simple health check for this router specifically
router.get('/status', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API v1 is operational' });
});


export { router as apiV1Router };