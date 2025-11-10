// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { fetchProducts } from '@/api/products.js';
// import { useCartStore } from '@/store/cartStore.js';
// import { FiChevronRight } from 'react-icons/fi';

// // --- 1. Hero Section with SVG Wave Divider ---
// const HeroSection = () => (
//   <div className="relative bg-brand-green text-white overflow-hidden">
//     <div className="container mx-auto px-6 py-20 text-center">
//       <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
//         Pure, Simple, Farm-Fresh.
//       </h1>
//       <p className="mt-4 text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
//         Experience the true taste of nature with produce sourced from local farms and delivered with care.
//       </p>
//       <Link 
//         to="/products"
//         className="mt-10 inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
//       >
//         Explore Our Products <FiChevronRight />
//       </Link>
//     </div>
//     {/* SVG Wave Divider for a soft, organic transition */}
//     <div className="absolute bottom-[-8vw] left-0 w-full">
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//         <path fill="#f5f5dc" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,133.3C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
//       </svg>
//     </div>
//   </div>
// );

// // --- 2. Redesigned Featured Products ---
// const FeaturedProducts = () => {
//   const { addToCart } = useCartStore();
//   const { data, isLoading } = useQuery({
//     queryKey: ['products'],
//     queryFn: fetchProducts,
//   });

//   const featured = data?.results?.slice(0, 4) || [];

//   return (
//     <div className="bg-brand-beige py-20">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-brand-green">Our Freshest Picks</h2>
//           <p className="text-lg text-gray-600 mt-2">Hand-selected for you, from our farm to your table.</p>
//         </div>
        
//         {isLoading ? (
//           <div className="text-center">Loading...</div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {featured.map(product => (
//               <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
//                 <div className="w-full h-56 bg-gray-200 relative flex items-center justify-center">
//                   {/* Fixed: Use actual product image or placeholder */}
//                   <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
//                   <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <button 
//                       onClick={() => addToCart(product)}
//                       className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//                 <div className="p-5 text-center">
//                   <h3 className="text-xl font-semibold text-brand-text">{product.name}</h3>
//                   <p className="text-brand-green-light font-medium mt-1">₹{product.price} / {product.unit}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- 3. Redesigned Testimonials ---
// const Testimonials = () => (
//   <div className="bg-white py-20">
//     <div className="container mx-auto px-6">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold text-brand-green">Loved by Our Community</h2>
//         <p className="text-lg text-gray-600 mt-2">Real stories from our happy customers.</p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Testimonial Cards with Avatars */}
//         <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
//           <img src="https://i.pravatar.cc/100?u=a" alt="Anjali P." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
//           <p className="text-brand-text italic mt-6">"The quality is just incredible. My salads have never tasted better! Truly a game-changer for my family's health."</p>
//           <p className="mt-4 font-bold text-brand-green-light">- Anjali P.</p>
//         </div>
//         <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
//           <img src="https://i.pravatar.cc/100?u=b" alt="Rohan M." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
//           <p className="text-brand-text italic mt-6">"Reliable, fresh, and always delivered with a smile. Suprabhat has become an essential part of my weekly routine."</p>
//           <p className="mt-4 font-bold text-brand-green-light">- Rohan M.</p>
//         </div>
//         <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
//           <img src="https://i.pravatar.cc/100?u=c" alt="Priya K." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
//           <p className="text-brand-text italic mt-6">"Finally, a place that values quality over everything. You can feel the passion they have for providing the best produce."</p>
//           <p className="mt-4 font-bold text-brand-green-light">- Priya K.</p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // --- Main HomePage Component ---
// const HomePage = () => {
//   return (
//     <div>
//       <HeroSection />
//       <FeaturedProducts />
//       <Testimonials />
//     </div>
//   );
// };

// export default HomePage;

// File: src/pages/HomePage.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/api/products.js';
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js'; // Import auth store
import { FiChevronRight } from 'react-icons/fi';

// --- 1. Hero Section with SVG Wave Divider --- (No change)
const HeroSection = () => (
  <div className="relative bg-brand-green text-white overflow-hidden">
    <div className="container mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
        Pure, Simple, Farm-Fresh.
      </h1>
      <p className="mt-4 text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
        Experience the true taste of nature with produce sourced from local farms and delivered with care.
      </p>
      <Link 
        to="/products"
        className="mt-10 inline-flex items-center gap-2 bg-brand-accent text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
      >
        Explore Our Products <FiChevronRight />
      </Link>
    </div>
    {/* SVG Wave Divider for a soft, organic transition */}
    <div className="absolute bottom-[-8vw] left-0 w-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#f5f5dc" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,133.3C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  </div>
);

// --- 2. Redesigned FeaturedProducts ---
const FeaturedProducts = () => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore(); // Get auth status
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path for redirection

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featured = data?.results?.slice(0, 4) || [];

  // New handler for "Add to Cart" button click
  const handleAddToCartClick = (product) => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      alert('Please register or log in to add items to your cart.'); // Optional user feedback
      navigate('/login', { state: { from: location.pathname } }); // Pass current path in state
    } else {
      // If authenticated, proceed to add to cart
      addToCart(product);
    }
  };

  return (
    <div className="bg-brand-beige py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-green">Our Freshest Picks</h2>
          <p className="text-lg text-gray-600 mt-2">Hand-selected for you, from our farm to your table.</p>
        </div>
        
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                <div className="w-full h-56 bg-gray-200 relative flex items-center justify-center">
                  {/* Fixed: Use actual product image or placeholder */}
                  <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.name} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleAddToCartClick(product)} // Use the new handler
                      className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-brand-text">{product.name}</h3>
                  <p className="text-brand-green-light font-medium mt-1">₹{product.price} / {product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Redesigned Testimonials --- (No change)
const Testimonials = () => (
  <div className="bg-white py-20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-brand-green">Loved by Our Community</h2>
        <p className="text-lg text-gray-600 mt-2">Real stories from our happy customers.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Testimonial Cards with Avatars */}
        <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
          <img src="https://i.pravatar.cc/100?u=a" alt="Anjali P." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <p className="text-brand-text italic mt-6">"The quality is just incredible. My salads have never tasted better! Truly a game-changer for my family's health."</p>
          <p className="mt-4 font-bold text-brand-green-light">- Anjali P.</p>
        </div>
        <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
          <img src="https://i.pravatar.cc/100?u=b" alt="Rohan M." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <p className="text-brand-text italic mt-6">"Reliable, fresh, and always delivered with a smile. Suprabhat has become an essential part of my weekly routine."</p>
          <p className="mt-4 font-bold text-brand-green-light">- Rohan M.</p>
        </div>
        <div className="bg-brand-beige p-8 rounded-xl shadow-sm text-center">
          <img src="https://i.pravatar.cc/100?u=c" alt="Priya K." className="w-20 h-20 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
          <p className="text-brand-text italic mt-6">"Finally, a place that values quality over everything. You can feel the passion they have for providing the best produce."</p>
          <p className="mt-4 font-bold text-brand-green-light">- Priya K.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main HomePage Component --- (No change)
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