// File: src/pages/CheckoutPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders.js';
import { useNavigate, Navigate } from 'react-router-dom';
import httpStatus from 'http-status';

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Delivery address is required and must be at least 10 characters long'),
  // Add payment method selection if needed later
});

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const DELIVERY_FEE = 50;
  const subTotal = getTotalPrice();
  const totalAmount = subTotal + DELIVERY_FEE;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: user?.addresses?.[0] || '', // Pre-fill if user has a default address
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart(); // Clear cart on successful order
      alert(`Order #${data._id.slice(-6)} placed successfully!`);
      navigate('/profile', { state: { activeTab: 'orders' } }); // Redirect to profile orders
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      alert(`Order Error: ${errorMessage}`);
    },
  });

  if (!isAuthenticated) {
    // If not authenticated, redirect to login page.
    // The `state` prop will allow us to redirect back here after login.
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (items.length === 0) {
    // Redirect to cart if it's empty
    return <Navigate to="/cart" replace />;
  }

  const onSubmit = (formData) => {
    const orderItems = items.map(cartItem => ({
      productId: cartItem.product._id,
      quantity: cartItem.quantity,
    }));

    const orderPayload = {
      items: orderItems,
      deliveryAddress: formData.deliveryAddress,
      // paymentMethod: 'Cash On Delivery', // Could be dynamic from form
    };
    createOrderMutation.mutate(orderPayload);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex justify-between items-center text-gray-700">
                <span className="flex-grow">{product.name} (x{quantity})</span>
                <span className="font-medium">₹{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium">₹{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-brand-text">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details and Place Order */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                id="deliveryAddress"
                {...register('deliveryAddress')}
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
                placeholder="Enter your full delivery address"
              ></textarea>
              {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>}
            </div>

            {/* Payment Method - Placeholder for now */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentMethod"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                disabled
              >
                <option>Cash On Delivery (Default)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">More payment options coming soon!</p>
            </div>

            <button
              type="submit"
              disabled={createOrderMutation.isLoading}
              className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createOrderMutation.isLoading ? 'Placing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
            </button>
            {createOrderMutation.isError && (
              <p className="text-red-500 text-sm text-center">
                {createOrderMutation.error.response?.data?.message || 'An unexpected error occurred.'}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;