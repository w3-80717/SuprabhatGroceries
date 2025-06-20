import React from 'react';

const AboutPage = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">About Suprabhat</h2>
      <div className="bg-white p-8 rounded-lg shadow-sm space-y-4 text-gray-700">
        <p>
          Welcome to Suprabhat Fruit and Vegetable Shop! We are a hyper-local, community-focused shop dedicated to bringing you the freshest produce available.
        </p>
        <p>
          Our mission is to replace impersonal, large-scale grocery shopping with a personalized service that you can trust. We believe in quality over quantity, and our curated selection reflects that. Many of our items are sourced directly from local farms, and we often feature "picked today" specials to guarantee absolute freshness.
        </p>
        <h3 className="text-xl font-semibold pt-4">Our Promise</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Freshness Guarantee:</strong> We stand by the quality of our produce.</li>
          <li><strong>Curated Quality:</strong> Every item is hand-selected by our team.</li>
          <li><strong>Personalized Service:</strong> We're your friendly neighborhood shop, now online!</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;