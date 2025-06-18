import React from 'react';
import ProductList from '../components/ProductList';

const HomePage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
      <ProductList />
    </div>
  );
};

export default HomePage;