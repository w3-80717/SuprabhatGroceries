import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '@/api/users.js';
import { fetchMyOrders } from '@/api/orders.js';

// A component for the user's details
const MyDetails = ({ profile }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold mb-4">Account Details</h3>
    <div className="space-y-2">
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

// A component for the user's order history
const OrderHistory = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
  });

  if (isLoading) return <p>Loading order history...</p>;
  if (isError) return <p className="text-red-500">Could not fetch order history.</p>;

  const orders = data.results;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-bold">Order #{order._id.slice(-6)}</p>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{order.orderStatus}</span>
              </div>
              <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('details');

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div className="text-red-500">Error loading profile. Please try logging in again.</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
        >
          My Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
        >
          Order History
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'details' && <MyDetails profile={profile} />}
        {activeTab === 'orders' && <OrderHistory />}
      </div>
    </div>
  );
};

export default ProfilePage;