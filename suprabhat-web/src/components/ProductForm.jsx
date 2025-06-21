import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  category: z.string().min(3, 'Category is required'),
  unit: z.enum(['kg', 'piece', 'bunch', 'dozen']),
});

const ProductForm = ({ product, onSubmit, isLoading, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || { unit: 'kg' },
  });

  useEffect(() => {
    reset(product || { unit: 'kg' });
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input {...register('name')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input {...register('category')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input type="number" step="0.01" {...register('price')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" {...register('stock')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select {...register('unit')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="kg">kg</option>
            <option value="piece">piece</option>
            <option value="bunch">bunch</option>
            <option value="dozen">dozen</option>
          </select>
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};
export default ProductForm;