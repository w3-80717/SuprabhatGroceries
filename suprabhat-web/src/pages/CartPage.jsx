import React from 'react';

const CartPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500">Your cart is currently empty.</p>
      </div>
    </div>
  );
};

export default CartPage;