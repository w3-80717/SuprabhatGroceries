// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchProducts } from '@/api/products.js'; // Using absolute path alias
// import { useCartStore } from '@/store/cartStore.js'; // Import the cart store

// const ProductList = () => {
//   // Get the addToCart action from our Zustand store
//   const { addToCart } = useCartStore();

//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ['products'],
//     queryFn: fetchProducts,
//   });

//   if (isLoading) {
//     return <div className="text-center p-10">Loading products...</div>;
//   }

//   if (isError) {
//     return <div className="text-center p-10 text-red-500">Error fetching products: {error.message}</div>;
//   }

//   const products = data?.results || [];

//   return (
//     <div>
//       {products.length === 0 ? (
//         <p className="text-center p-10">No products found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col">
//               <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
//                 {/* Fixed: Use actual product image or placeholder */}
//                 <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
//               <p className="text-gray-600 mt-1">₹{product.price} / {product.unit}</p>
//               <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
//               </p>
//               <button
//                 onClick={() => addToCart({ ...product, qty: 1 })}
//                 disabled={product.stock === 0}
//                 className="mt-4 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// File: src/components/ProductList.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/products.js';
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js'; // Import auth store
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const ProductList = () => {
  // Get the addToCart action from our Zustand store
  const { addToCart } = useCartStore();
  // Get authentication status and navigate function
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path for redirection

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // New handler for "Add to Cart" button click
  const handleAddToCartClick = (product) => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      alert('Please register or log in to add items to your cart.'); // Optional user feedback
      navigate('/login', { state: { from: location.pathname } }); // Pass current path in state
    } else {
      // If authenticated, proceed to add to cart
      addToCart({ ...product, qty: 1 });
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Error fetching products: {error.message}</div>;
  }

  const products = data?.results || [];

  return (
    <div>
      {products.length === 0 ? (
        <p className="text-center p-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col">
              <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                {/* Fixed: Use actual product image or placeholder */}
                <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mt-1">₹{product.price} / {product.unit}</p>
              <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </p>
              <button
                onClick={() => handleAddToCartClick(product)} // Use the new handler
                disabled={product.stock === 0}
                className="mt-4 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;