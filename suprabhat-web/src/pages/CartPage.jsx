import React from 'react';
import { useCartStore } from '@/store/cartStore.js';

const CartPage = () => {
  // Get the full state and actions from the cart store
  const { 
    items, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getTotalPrice 
  } = useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h2>
      
      {items.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Your cart is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center justify-between border-b py-4">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button onClick={() => decrementQuantity(product._id)} className="px-3 py-1">-</button>
                    <span className="px-4">{quantity}</span>
                    <button onClick={() => incrementQuantity(product._id)} className="px-3 py-1">+</button>
                  </div>
                  <button onClick={() => removeFromCart(product._id)} className="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Delivery Fee</span>
                <span>₹50.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(totalPrice + 50).toFixed(2)}</span>
              </div>
              <button className="mt-6 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors">
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