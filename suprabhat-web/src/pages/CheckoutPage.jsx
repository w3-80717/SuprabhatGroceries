// // File: src/pages/CheckoutPage.jsx
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useCartStore } from '@/store/cartStore.js';
// import { useAuthStore } from '@/store/authStore.js';
// import { useMutation } from '@tanstack/react-query';
// import { createOrder } from '@/api/orders.js';
// import { useNavigate, Navigate } from 'react-router-dom';
// import httpStatus from 'http-status';

// const checkoutSchema = z.object({
//   deliveryAddress: z.string().min(10, 'Delivery address is required and must be at least 10 characters long'),
//   // Add payment method selection if needed later
// });

// const CheckoutPage = () => {
//   const { items, getTotalPrice, clearCart } = useCartStore();
//   const { isAuthenticated, user } = useAuthStore();
//   const navigate = useNavigate();

//   const DELIVERY_FEE = 50;
//   const subTotal = getTotalPrice();
//   const totalAmount = subTotal + DELIVERY_FEE;

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: {
//       deliveryAddress: user?.addresses?.[0] || '', // Pre-fill if user has a default address
//     },
//   });

//   const createOrderMutation = useMutation({
//     mutationFn: createOrder,
//     onSuccess: (data) => {
//       clearCart(); // Clear cart on successful order
//       alert(`Order #${data._id.slice(-6)} placed successfully!`);
//       navigate('/profile', { state: { activeTab: 'orders' } }); // Redirect to profile orders
//     },
//     onError: (error) => {
//       const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
//       alert(`Order Error: ${errorMessage}`);
//     },
//   });

//   if (!isAuthenticated) {
//     // If not authenticated, redirect to login page.
//     // The `state` prop will allow us to redirect back here after login.
//     return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
//   }

//   if (items.length === 0) {
//     // Redirect to cart if it's empty
//     return <Navigate to="/cart" replace />;
//   }

//   const onSubmit = (formData) => {
//     const orderItems = items.map(cartItem => ({
//       productId: cartItem.product._id,
//       quantity: cartItem.quantity,
//     }));

//     const orderPayload = {
//       items: orderItems,
//       deliveryAddress: formData.deliveryAddress,
//       // paymentMethod: 'Cash On Delivery', // Could be dynamic from form
//     };
//     createOrderMutation.mutate(orderPayload);
//   };

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Order Summary */}
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//           <div className="space-y-3">
//             {items.map(({ product, quantity }) => (
//               <div key={product._id} className="flex justify-between items-center text-gray-700">
//                 <span className="flex-grow">{product.name} (x{quantity})</span>
//                 <span className="font-medium">₹{(product.price * quantity).toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="border-t pt-4 mt-4 space-y-2">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span className="font-medium">₹{subTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Fee</span>
//               <span className="font-medium">₹{DELIVERY_FEE.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between font-bold text-lg text-brand-text">
//               <span>Total Amount</span>
//               <span>₹{totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Delivery Details and Place Order */}
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
//               <textarea
//                 id="deliveryAddress"
//                 {...register('deliveryAddress')}
//                 rows="4"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
//                 placeholder="Enter your full delivery address"
//               ></textarea>
//               {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>}
//             </div>

//             {/* Payment Method - Placeholder for now */}
//             <div>
//               <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
//               <select
//                 id="paymentMethod"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
//                 disabled
//               >
//                 <option>Cash On Delivery (Default)</option>
//               </select>
//               <p className="text-sm text-gray-500 mt-1">More payment options coming soon!</p>
//             </div>

//             <button
//               type="submit"
//               disabled={createOrderMutation.isLoading}
//               className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//             >
//               {createOrderMutation.isLoading ? 'Placing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
//             </button>
//             {createOrderMutation.isError && (
//               <p className="text-red-500 text-sm text-center">
//                 {createOrderMutation.error.response?.data?.message || 'An unexpected error occurred.'}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

// File: src/pages/AuthPage.jsx

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { loginUser, registerUser } from '@/api/auth';
// import { useAuthStore } from '@/store/authStore';

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { from } = location.state || { from: '/' };
//   const { login: loginToStore } = useAuthStore();

//   // Local state for form inputs
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Local state for loading and error messages
//   const [isLoading, setIsLoading] = useState(false);
//   const [formErrors, setFormErrors] = useState({}); // For client-side validation errors
//   const [serverError, setServerError] = useState(''); // For API errors

//   const validateForm = () => {
//     const errors = {};
//     let isValid = true;

//     if (!email) {
//       errors.email = 'Email is required';
//       isValid = false;
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       errors.email = 'Invalid email address';
//       isValid = false;
//     }

//     if (!password) {
//       errors.password = 'Password is required';
//       isValid = false;
//     } else if (password.length < 8) {
//       errors.password = 'Password must be at least 8 characters';
//       isValid = false;
//     }

//     if (!isLogin && (!name || name.length < 2)) {
//       errors.name = 'Name must be at least 2 characters';
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     setServerError(''); // Clear previous server errors
//     if (!validateForm()) {
//       return; // Stop if client-side validation fails
//     }

//     setIsLoading(true);
//     try {
//       let data;
//       if (isLogin) {
//         data = await loginUser({ email, password });
//       } else {
//         data = await registerUser({ name, email, password });
//       }
//       loginToStore(data);
//       navigate(from, { replace: true });
//     } catch (error) {
//       setServerError(error.response?.data?.message || 'An unexpected error occurred.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2 style={{fontSize:'20px', fontWeight:'bold'}}>{isLogin ? 'Login' : 'Create Account'}</h2>
//       <form onSubmit={onSubmit}>
//         {!isLogin && (
//           <div style={{ marginBottom: '1rem' }}>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
//             />
//             {formErrors.name && <p style={{ color: 'red', fontSize: '12px' }}>{formErrors.name}</p>}
//           </div>
//         )}
//         <div style={{ marginBottom: '1rem' }}>
//           <label className="block text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
//           />
//           {formErrors.email && <p style={{ color: 'red', fontSize: '12px' }}>{formErrors.email}</p>}
//         </div>
//         <div style={{ marginBottom: '1rem' }}>
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
//           />
//           {formErrors.password && <p style={{ color: 'red', fontSize: '12px' }}>{formErrors.password}</p>}
//         </div>

//         {serverError && <p style={{ color: 'red', marginBottom: '1rem' }}>{serverError}</p>}

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
//         </button>
//       </form>
//       <p className="mt-4 text-center text-gray-600">
//         {isLogin ? "Don't have an account?" : 'Already have an account?'}
//         <button
//           onClick={() => {
//             setIsLogin(!isLogin);
//             // Clear form fields and errors when switching
//             setName('');
//             setEmail('');
//             setPassword('');
//             setFormErrors({});
//             setServerError('');
//           }}
//           className="ml-1 text-brand-green hover:text-brand-green-light font-medium"
//         >
//           {isLogin ? 'Register' : 'Login'}
//         </button>
//       </p>
//     </div>
//   );
// };

// export default AuthPage;

// File: src/pages/CheckoutPage.jsx (No changes from previous step needed)

// File: src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { createOrder } from '@/api/orders.js'; // Direct API call
import { useNavigate, Navigate } from 'react-router-dom';
// Removed httpStatus import as it's not directly used for client-side logic

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Local state for delivery address and form management
  const [deliveryAddress, setDeliveryAddress] = useState(user?.addresses?.[0] || '');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Replaces createOrderMutation.isLoading
  const [serverError, setServerError] = useState(''); // Replaces createOrderMutation.error

  const DELIVERY_FEE = 50;
  const subTotal = getTotalPrice();
  const totalAmount = subTotal + DELIVERY_FEE;

  // Effect to trigger alert if unauthenticated, and to pre-fill address if user data loads later
  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in or register to proceed to checkout.');
    }
    // Also update default delivery address if user object changes (e.g., after login/profile load)
    if (isAuthenticated && user?.addresses?.[0] && !deliveryAddress) {
        setDeliveryAddress(user.addresses[0]);
    }
  }, [isAuthenticated, user, deliveryAddress]);


  // If not authenticated, redirect to login page immediately
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Manual client-side validation
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!deliveryAddress || deliveryAddress.length < 10) {
      errors.deliveryAddress = 'Delivery address is required and must be at least 10 characters long';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setServerError(''); // Clear previous server errors
    if (!validateForm()) {
      return; // Stop if client-side validation fails
    }

    setIsLoading(true);
    try {
      const orderItems = items.map(cartItem => ({
        productId: cartItem.product._id,
        quantity: cartItem.quantity,
      }));

      const orderPayload = {
        items: orderItems,
        deliveryAddress: deliveryAddress,
        // paymentMethod: 'Cash On Delivery', // Could be dynamic from form
      };

      const data = await createOrder(orderPayload); // Direct API call
      clearCart(); // Clear cart on successful order
      alert(`Order #${data._id.slice(-6)} placed successfully!`);
      navigate('/profile', { state: { activeTab: 'orders' } }); // Redirect to profile orders
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      setServerError(errorMessage); // Set server error message
      alert(`Order Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
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
          <form onSubmit={onSubmit} className="space-y-4"> {/* Use local onSubmit handler */}
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress} // Controlled component
                onChange={(e) => setDeliveryAddress(e.target.value)} // Update state on change
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
                placeholder="Enter your full delivery address"
              ></textarea>
              {formErrors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{formErrors.deliveryAddress}</p>}
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
              disabled={isLoading} // Use local isLoading state
              className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Placing Order...' : `Place Order (₹${totalAmount.toFixed(2)})`}
            </button>
            {serverError && ( // Display local serverError
              <p className="text-red-500 text-sm text-center">
                {serverError}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;