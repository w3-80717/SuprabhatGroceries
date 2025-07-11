import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';
import { useCartStore } from '@/store/cartStore.js';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- NEW: Determine if the logged-in user is an admin ---
  const isAdmin = user?.role === 'admin';

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      {/* Main Header Bar */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-green hover:text-green-700">
          <img src="/suprabhaticon.png" alt="Suprabhat Logo" className='h-12 w-12' />
          <span>Suprabhat</span>
        </Link>
        
        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-gray-700 hover:text-brand-green font-medium">Shop</Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-green font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-green font-medium">Contact</Link>
          
          {/* --- NEW: Conditionally render Admin link for desktop --- */}
          {isAdmin && (
             <Link to="/admin/products" className="font-bold text-brand-accent hover:text-orange-500">Admin Panel</Link>
          )}

          <Link to="/cart" className="relative text-gray-700 hover:text-brand-green">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-brand-green font-medium">Profile</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-brand-green font-medium bg-transparent border-none cursor-pointer p-0">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-brand-green font-medium">Login</Link>
          )}
        </nav>

        {/* --- Mobile Menu Button (Hamburger) --- */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="relative text-gray-700 hover:text-brand-green mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {totalItems > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>}
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 text-2xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <Link to="/products" onClick={closeMenu} className="text-gray-700 hover:text-brand-green font-medium">Shop</Link>
            <Link to="/about" onClick={closeMenu} className="text-gray-700 hover:text-brand-green font-medium">About</Link>
            <Link to="/contact" onClick={closeMenu} className="text-gray-700 hover:text-brand-green font-medium">Contact</Link>
            
            {/* --- NEW: Conditionally render Admin link for mobile --- */}
            {isAdmin && (
              <Link to="/admin/products" onClick={closeMenu} className="font-bold text-brand-accent hover:text-orange-500">Admin Panel</Link>
            )}

            <div className="border-t w-full my-2"></div>

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={closeMenu} className="text-gray-700 hover:text-brand-green font-medium">Profile</Link>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="text-gray-700 hover:text-brand-green font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="text-gray-700 hover:text-brand-green font-medium">Login</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;