// In src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';
import { useCartStore } from '@/store/cartStore.js';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800 hover:text-green-700">
          Suprabhat
        </Link>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <Link to="/" className="text-gray-700 hover:text-green-800 font-medium">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-green-800 font-medium">About</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-800 font-medium">Product</Link>
           {/* <-- Add Link */}
          
          <Link to="/cart" className="relative text-gray-700 hover:text-green-800 font-medium">
            {/* Shopping cart icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {/* Cart item count badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-green-800 font-medium">Profile</Link> {/* <-- Add Link */}
              <button onClick={handleLogout} className="...">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-green-800 font-medium">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;