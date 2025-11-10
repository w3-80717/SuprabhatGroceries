// // File: src/pages/CartPage.jsx

// import React from 'react';
// import { useCartStore } from '@/store/cartStore.js';
// import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
// import { useAuthStore } from '@/store/authStore.js'; // Import auth store

// const CartPage = () => {
//   const {
//     items = [],
//     removeFromCart,
//     incrementQuantity,
//     decrementQuantity,
//     getTotalPrice
//   } = useCartStore();
//   const { isAuthenticated } = useAuthStore(); // Check authentication status
//   const navigate = useNavigate();

//   const DELIVERY_FEE = 50;

//   // fallback total calculation if store doesn't provide getTotalPrice
//   const totalPrice = (typeof getTotalPrice === 'function')
//     ? getTotalPrice()
//     : items.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 0)), 0);

//   const handleProceedToCheckout = () => {
//     if (!isAuthenticated) {
//       navigate('/login', { state: { from: '/cart' } }); // Redirect to login, then back to cart
//     } else {
//       navigate('/checkout'); // Proceed to checkout page
//     }
//   };

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>

//       {items.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <p className="text-gray-500">Your cart is currently empty.</p>
//           <Link to="/products" className="mt-4 inline-block bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-brand-green-light">
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items List */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map(({ product, quantity }) => (
//               <div
//                 key={product._id ?? product.id}
//                 className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
//               >
//                 {/* Product Info */}
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
//                     <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold">{product?.name}</h3>
//                     <p className="text-gray-600">₹{(product?.price ?? 0).toFixed(2)}</p>
//                     {product?.unit && <p className="text-sm text-gray-500">/ {product.unit}</p>}
//                   </div>
//                 </div>

//                 {/* Quantity and Remove */}
//                 <div className="flex items-center gap-4 self-end sm:self-center">
//                   <div className="flex items-center border rounded">
//                     <button
//                       onClick={() => decrementQuantity?.(product._id ?? product.id)}
//                       className="px-3 py-1"
//                       aria-label="Decrease quantity"
//                     >
//                       -
//                     </button>
//                     <span className="px-4">{quantity}</span>
//                     <button
//                       onClick={() => incrementQuantity?.(product._id ?? product.id)}
//                       className="px-3 py-1"
//                       aria-label="Increase quantity"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => removeFromCart?.(product._id ?? product.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
//               <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span>₹{totalPrice.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between mb-4">
//                 <span>Delivery Fee</span>
//                 <span>₹{DELIVERY_FEE.toFixed(2)}</span>
//               </div>
//               <div className="border-t pt-4 flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>₹{(totalPrice + DELIVERY_FEE).toFixed(2)}</span>
//               </div>
//               {/* Change button to call handler */}
//               <button
//                 onClick={handleProceedToCheckout}
//                 className="mt-6 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;


// File: src/pages/CartPage.jsx

// import React from 'react';
// import { useCartStore } from '@/store/cartStore.js';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore.js';

// const CartPage = () => {
//   const {
//     items = [],
//     removeFromCart,
//     incrementQuantity,
//     decrementQuantity,
//     getTotalPrice
//   } = useCartStore();
//   const { isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();

//   const DELIVERY_FEE = 50;

//   const totalPrice = (typeof getTotalPrice === 'function')
//     ? getTotalPrice()
//     : items.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 0)), 0);

//   const handleProceedToCheckout = () => {
//     if (!isAuthenticated) {
//       // --- NEW: Add alert pop-up here ---
//       alert('Please log in or register to proceed to checkout.');
//       navigate('/login', { state: { from: '/cart' } }); // Redirect to login, then back to cart
//     } else {
//       navigate('/checkout'); // Proceed to checkout page
//     }
//   };

//   return (
//     <div className="container mx-auto px-6 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>

//       {items.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <p className="text-gray-500">Your cart is currently empty.</p>
//           <Link to="/products" className="mt-4 inline-block bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-brand-green-light">
//             Start Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items List */}
//           <div className="lg:col-span-2 space-y-4">
//             {items.map(({ product, quantity }) => (
//               <div
//                 key={product._id ?? product.id}
//                 className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
//               >
//                 {/* Product Info */}
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
//                     <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold">{product?.name}</h3>
//                     <p className="text-gray-600">₹{(product?.price ?? 0).toFixed(2)}</p>
//                     {product?.unit && <p className="text-sm text-gray-500">/ {product.unit}</p>}
//                   </div>
//                 </div>

//                 {/* Quantity and Remove */}
//                 <div className="flex items-center gap-4 self-end sm:self-center">
//                   <div className="flex items-center border rounded">
//                     <button
//                       onClick={() => decrementQuantity?.(product._id ?? product.id)}
//                       className="px-3 py-1"
//                       aria-label="Decrease quantity"
//                     >
//                       -
//                     </button>
//                     <span className="px-4">{quantity}</span>
//                     <button
//                       onClick={() => incrementQuantity?.(product._id ?? product.id)}
//                       className="px-3 py-1"
//                       aria-label="Increase quantity"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => removeFromCart?.(product._id ?? product.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
//               <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span>₹{totalPrice.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between mb-4">
//                 <span>Delivery Fee</span>
//                 <span>₹{DELIVERY_FEE.toFixed(2)}</span>
//               </div>
//               <div className="border-t pt-4 flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>₹{(totalPrice + DELIVERY_FEE).toFixed(2)}</span>
//               </div>
//               <button
//                 onClick={handleProceedToCheckout}
//                 className="mt-6 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors"
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;


// File: src/pages/CartPage.jsx (No changes from previous step needed)

import React from 'react';
import { useCartStore } from '@/store/cartStore.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';

const CartPage = () => {
  const {
    items = [],
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const DELIVERY_FEE = 50;

  const totalPrice = (typeof getTotalPrice === 'function')
    ? getTotalPrice()
    : items.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 0)), 0);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // --- Alert for unauthenticated users trying to checkout ---
      alert('Please log in or register to proceed to checkout.');
      navigate('/login', { state: { from: '/cart' } }); // Redirect to login, then back to cart
    } else {
      navigate('/checkout'); // Proceed to checkout page
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>

      {items.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Your cart is currently empty.</p>
          <Link to="/products" className="mt-4 inline-block bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-brand-green-light">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product._id ?? product.id}
                className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                    <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{product?.name}</h3>
                    <p className="text-gray-600">₹{(product?.price ?? 0).toFixed(2)}</p>
                    {product?.unit && <p className="text-sm text-gray-500">/ {product.unit}</p>}
                  </div>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => decrementQuantity?.(product._id ?? product.id)}
                      className="px-3 py-1"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button
                      onClick={() => incrementQuantity?.(product._id ?? product.id)}
                      className="px-3 py-1"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart?.(product._id ?? product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(totalPrice + DELIVERY_FEE).toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="mt-6 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;