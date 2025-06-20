import React from 'react';
import ProductList from '@/components/ProductList';

const ProductsPage = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
       <h2 className="text-3xl font-bold text-gray-800 mb-6">All Products</h2>
      <p className="text-gray-600 mb-8">Browse our hand-picked selection of the freshest fruits and vegetables.</p>
      <ProductList />
    </div>
  );
};

export default ProductsPage;