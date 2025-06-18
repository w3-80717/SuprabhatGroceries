import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800 hover:text-green-700">
          Suprabhat
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-green-800 font-medium">Home</Link>
          <Link to="/cart" className="text-gray-700 hover:text-green-800 font-medium">Cart (0)</Link>
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium">Hi, {user.name}</span>
              <button 
                onClick={handleLogout} 
                className="text-gray-700 hover:text-green-800 font-medium bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-green-800 font-medium">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;