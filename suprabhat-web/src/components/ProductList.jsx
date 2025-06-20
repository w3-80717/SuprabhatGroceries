import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/products.js'; // Using absolute path alias
import { useCartStore } from '@/store/cartStore.js'; // Import the cart store

const ProductList = () => {
  // Get the addToCart action from our Zustand store
  const { addToCart } = useCartStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

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
                <span className="text-gray-500">Image</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mt-1">₹{product.price} / {product.unit}</p>
              <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </p>
              <button 
                // CRITICAL FIX: Pass a function to onClick, don't call it directly
                onClick={() => addToCart(product)} 
                disabled={product.stock === 0}
                className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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