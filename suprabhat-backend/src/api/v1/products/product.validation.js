import { z } from 'zod';
import mongoose from 'mongoose';

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be a positive number'),
    unit: z.enum(['kg', 'piece', 'bunch', 'dozen']),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    images: z.array(z.string().url()).optional(),
    sourcingDetails: z.string().optional(),
    freshnessTag: z.string().optional(),
  }),
});

const getProductsSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    sortBy: z.string().optional(), // e.g., 'price:asc', 'createdAt:desc'
    priceMin: z.coerce.number().optional(),
    priceMax: z.coerce.number().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    searchQuery: z.string().optional(),
    inStock: z.enum(['true', 'false']).optional(),
  }),
});

const productIdSchema = z.object({
  params: z.object({
    productId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid Product ID' }),
  }),
});

const updateProductSchema = z.object({
  params: productIdSchema.shape.params,
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      unit: z.enum(['kg', 'piece', 'bunch', 'dozen']).optional(),
      category: z.string().min(1).optional(),
      stock: z.number().int().nonnegative().optional(),
      images: z.array(z.string().url()).optional(),
      sourcingDetails: z.string().optional(),
      freshnessTag: z.string().optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Update body cannot be empty',
    }),
});

export const productValidation = {
  createProductSchema,
  getProductsSchema,
  productIdSchema,
  updateProductSchema,
};