import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx'; // <-- Import Footer
import HomePage from '@/pages/HomePage.jsx';
import ProductsPage from '@/pages/ProductsPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx'; // <-- Import Contact Page
//... other imports
import AdminLayout from '@/components/AdminLayout.jsx';
import ProductManagementPage from '@/pages/admin/ProductManagementPage.jsx';

function App() {
  return (
    <Router>
      <div className="bg-brand-beige min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow"> {/* Use flex-grow to push footer down */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} /> {/* <-- Add Route */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
             <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductManagementPage />} />
              {/* Add more admin routes here like <Route path="orders" ... /> */}
            </Route>
          </Routes>
        </main>
        <Footer /> {/* <-- Add Footer here */}
      </div>
    </Router>
  );
}

export default App;