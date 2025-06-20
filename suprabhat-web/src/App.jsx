// In src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import HomePage from '@/pages/HomePage.jsx'; // This will be our new landing page
import ProductsPage from '@/pages/ProductsPage.jsx'; // Our renamed catalog page
import CartPage from '@/pages/CartPage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main> {/* Remove container styles from here to allow full-width sections */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} /> {/* New catalog route */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;