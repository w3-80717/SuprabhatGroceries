// File: src/api/v1/orders/order.validation.js

import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ID format',
});

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: objectIdSchema,
          quantity: z.number().int().positive(),
        })
      )
      .nonempty('Order must contain at least one item'),
    deliveryAddress: z.string().min(10, 'Delivery address is required'),
    // paymentMethod could be added here
  }),
});

const getOrderSchema = z.object({
    params: z.object({
        orderId: objectIdSchema,
    }),
});

export const orderValidation = {
  createOrderSchema,
  getOrderSchema,
};