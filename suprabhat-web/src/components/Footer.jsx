import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-green text-green-100 mt-16">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Suprabhat</h3>
            <p className="text-green-200">
              Your daily source for fresh, locally-sourced produce. Delivered with care, from our community to yours.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <p className="text-green-200">Pune, Maharashtra</p>
            <p className="text-green-200 mt-2">suprabhat.fresh@example.com</p>
            <p className="text-green-200 mt-2">+91 98765 43210</p>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white text-2xl transition-transform hover:scale-110">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white text-2xl transition-transform hover:scale-110">
                <FaFacebook />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-green-100 hover:text-white text-2xl transition-transform hover:scale-110">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200 text-sm">
          <p>© {new Date().getFullYear()} Suprabhat. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;