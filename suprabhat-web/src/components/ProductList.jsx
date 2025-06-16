import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';

const ProductList = () => {
  // Use TanStack Query to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'], // A unique key for this query
    queryFn: fetchProducts,   // The function that will fetch the data
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error fetching products: {error.message}</div>;
  }

  // The actual array of products is in data.results
  const products = data?.results || [];

  return (
    <div>
      <h2>Our Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price} / {product.unit}</p>
              <p>In Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;