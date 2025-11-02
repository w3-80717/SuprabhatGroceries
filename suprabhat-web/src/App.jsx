import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';
import ProductsPage from '@/pages/ProductsPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import CheckoutPage from '@/pages/CheckoutPage.jsx'; // <-- NEW IMPORT
import AdminLayout from '@/components/AdminLayout.jsx';
import ProductManagementPage from '@/pages/admin/ProductManagementPage.jsx';
import OrderManagementPage from '@/pages/admin/OrderManagementPage.jsx'; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      <div className="bg-brand-beige min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} /> {/* <-- NEW ROUTE */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductManagementPage />} />
              <Route path="orders" element={<OrderManagementPage />} /> {/* <-- NEW ADMIN ROUTE */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;