// In src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import HomePage from '@/pages/HomePage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx'; // <-- Import
import AboutPage from '@/pages/AboutPage.jsx';   // <-- Import

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* <-- Add Route */}
            <Route path="/about" element={<AboutPage />} />   {/* <-- Add Route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;