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

// --- New Admin Validation Schemas ---

const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: objectIdSchema,
  }),
  body: z.object({
    status: z.enum(['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed'], {
      message: 'Invalid order status',
    }),
  }),
});

// Optional: Schema for admin listing with pagination/filters if needed in the future
const listAllOrdersAdminSchema = z.object({
  query: z.object({
    status: z.enum(['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed']).optional(),
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().default(10).optional(),
    sortBy: z.string().optional(), // e.g., 'createdAt:desc'
  }).optional(),
});


export const orderValidation = {
  createOrderSchema,
  getOrderSchema,
  updateOrderStatusSchema, // Export new validation schema
  listAllOrdersAdminSchema, // Export new validation schema
};