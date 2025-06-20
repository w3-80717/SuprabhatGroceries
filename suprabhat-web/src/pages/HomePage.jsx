import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/products.js';
import { useCartStore } from '@/store/cartStore.js';

// --- Sub-components for a clean structure ---

// 1. Hero Section (The main banner/carousel area)
const HeroSection = () => (
  <div className="bg-green-100">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-green-900">
        Freshness Delivered Daily
      </h1>
      <p className="mt-4 text-lg text-green-800">
        The best locally sourced, farm-fresh fruits and vegetables, right to your doorstep.
      </p>
      <Link 
        to="/products"
        className="mt-8 inline-block bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-800 transition-transform transform hover:scale-105"
      >
        Shop Now
      </Link>
    </div>
  </div>
);

// 2. Featured Products Section
const FeaturedProducts = () => {
  const { addToCart } = useCartStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'], // We can reuse the same query key
    queryFn: fetchProducts,
  });

  if (isLoading || isError) {
    // Don't show the section if data isn't ready
    return null;
  }
  
  // Show only the first 4 products as "featured"
  const featured = data?.results?.slice(0, 4) || [];

  return (
    <div className="container mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Today's Specials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map(product => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image</span>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mt-1">₹{product.price} / {product.unit}</p>
              <button 
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Testimonials Section
const Testimonials = () => (
  <div className="bg-white py-16">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        What Our Community Says
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Testimonial Card 1 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 italic">"The quality of the vegetables is unmatched! I can really taste the difference. It feels good to support a local business that cares."</p>
          <p className="mt-4 font-semibold text-right text-green-800">- Anjali P.</p>
        </div>
        {/* Testimonial Card 2 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 italic">"My weekly order from Suprabhat is something I look forward to. Everything is so fresh and the service is always friendly and reliable."</p>
          <p className="mt-4 font-semibold text-right text-green-800">- Rohan M.</p>
        </div>
        {/* Testimonial Card 3 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 italic">"I love the 'picked today' specials! It's amazing to get produce that was on the farm just hours before it gets to my kitchen."</p>
          <p className="mt-4 font-semibold text-right text-green-800">- Priya K.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main HomePage Component ---
const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <Testimonials />
    </div>
  );
};

export default HomePage;