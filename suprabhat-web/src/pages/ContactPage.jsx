import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-brand-green">Get In Touch</h2>
        <p className="text-lg text-gray-600 mt-2">
          We'd love to hear from you! Whether you have a question about our products, our service, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Section */}
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h3 className="text-2xl font-semibold text-brand-text">Contact Information</h3>
          <div className="flex items-start space-x-4">
            <FiMapPin className="text-brand-accent text-2xl mt-1" />
            <div>
              <h4 className="font-bold">Our Location</h4>
              <p className="text-gray-600">Pune, Maharashtra, India</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FiMail className="text-brand-accent text-2xl mt-1" />
            <div>
              <h4 className="font-bold">Email Us</h4>
              <a href="mailto:suprabhat.fresh@example.com" className="text-gray-600 hover:text-brand-green">suprabhat.fresh@example.com</a>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <FiPhone className="text-brand-accent text-2xl mt-1" />
            <div>
              <h4 className="font-bold">Call Us</h4>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-brand-text mb-6">Send us a Message</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;