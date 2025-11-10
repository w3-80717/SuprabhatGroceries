// import React, { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchMyProfile } from '@/api/users.js';
// import { fetchMyOrders } from '@/api/orders.js';
// import { useLocation } from 'react-router-dom'; // Import useLocation

// // A component for the user's details
// const MyDetails = ({ profile }) => (
//   <div className="bg-white p-6 rounded-lg shadow-sm">
//     <h3 className="text-xl font-semibold mb-4">Account Details</h3>
//     <div className="space-y-2">
//       <p><strong>Name:</strong> {profile.name}</p>
//       <p><strong>Email:</strong> {profile.email}</p>
//       <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
//     </div>
//   </div>
// );

// // A component for the user's order history
// const OrderHistory = () => {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['myOrders'],
//     queryFn: fetchMyOrders,
//   });

//   if (isLoading) return <p>Loading order history...</p>;
//   if (isError) return <p className="text-red-500">Could not fetch order history.</p>;

//   const orders = data.results;

//   // Define status colors for consistency
//   const statusColors = {
//     'Pending': 'bg-yellow-100 text-yellow-800',
//     'Confirmed': 'bg-blue-100 text-blue-800',
//     'Processing': 'bg-indigo-100 text-indigo-800',
//     'Out for Delivery': 'bg-purple-100 text-purple-800',
//     'Delivered': 'bg-green-100 text-green-800',
//     'Cancelled': 'bg-red-100 text-red-800',
//     'Payment Failed': 'bg-gray-100 text-gray-800',
//   };


//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm">
//       <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
//       {orders.length === 0 ? (
//         <p>You haven't placed any orders yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map(order => (
//             <div key={order._id} className="border p-4 rounded-md">
//               <div className="flex justify-between items-center">
//                 <p className="font-bold">Order #{order._id.slice(-6)}</p>
//                 <span className={`px-2 py-1 text-sm rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
//                   {order.orderStatus}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//               <p className="mt-2 font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
//               <div className="text-sm text-gray-700 mt-2">
//                 <p className="font-medium">Items:</p>
//                 <ul className="list-disc list-inside">
//                   {order.items.map(item => (
//                     <li key={item._id}>{item.name} (x{item.quantity}) - ₹{item.price.toFixed(2)} each</li>
//                   ))}
//                 </ul>
//               </div>
//               <p className="text-sm text-gray-600 mt-2">Delivery Address: {order.deliveryAddress}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


// const ProfilePage = () => {
//   const location = useLocation(); // Use useLocation hook
//   const [activeTab, setActiveTab] = useState('details');

//   // Effect to read state from location and set activeTab
//   useEffect(() => {
//     if (location.state?.activeTab) {
//       setActiveTab(location.state.activeTab);
//     }
//   }, [location.state]);


//   const { data: profile, isLoading, isError } = useQuery({
//     queryKey: ['myProfile'],
//     queryFn: fetchMyProfile,
//   });

//   if (isLoading) return <div>Loading profile...</div>;
//   if (isError) return <div className="text-red-500">Error loading profile. Please try logging in again.</div>;

//   return (
//     <div className="container mx-auto px-6 py-8"> {/* Added container for consistent styling */}
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
//       {/* Tabs Navigation */}
//       <div className="flex border-b mb-6">
//         <button
//           onClick={() => setActiveTab('details')}
//           className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}
//         >
//           My Details
//         </button>
//         <button
//           onClick={() => setActiveTab('orders')}
//           className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}
//         >
//           Order History
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {activeTab === 'details' && <MyDetails profile={profile} />}
//         {activeTab === 'orders' && <OrderHistory />}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '@/api/users.js';
import { fetchMyOrders } from '@/api/orders.js';
import { useLocation } from 'react-router-dom';

// MyDetails Component
const MyDetails = ({ profile }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold mb-4">Account Details</h3>
    <div className="space-y-2">
      <p><strong>Name:</strong> {profile?.name || 'Guest User'}</p>
      <p><strong>Email:</strong> {profile?.email || 'Not Available'}</p>
      <p><strong>Joined:</strong> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}</p>
    </div>
  </div>
);

// OrderHistory Component
const OrderHistory = ({ loggedIn }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    enabled: loggedIn, // only fetch if logged in
  });

  if (!loggedIn) {
    return <p className="text-gray-600">Please log in to view your order history.</p>;
  }

  if (isLoading) return <p>Loading order history...</p>;
  if (isError) return <p className="text-red-500">Could not fetch order history.</p>;

  const orders = data?.results || [];
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    Processing: 'bg-indigo-100 text-indigo-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    'Payment Failed': 'bg-gray-100 text-gray-800',
  };

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
                <span className={`px-2 py-1 text-sm rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 font-semibold">Total: ₹{order.totalAmount.toFixed(2)}</p>
              <div className="text-sm text-gray-700 mt-2">
                <p className="font-medium">Items:</p>
                <ul className="list-disc list-inside">
                  {order.items.map(item => (
                    <li key={item._id}>{item.name} (x{item.quantity}) - ₹{item.price.toFixed(2)} each</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-2">Delivery Address: {order.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ProfilePage Component
const ProfilePage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('details');
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
    retry: false,
    onError: (err) => {
      // If error means unauthenticated, mark as guest
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoggedIn(false);
      }
    },
  });

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>

      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}
        >
          My Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-brand-green text-brand-green' : 'text-gray-500'}`}
        >
          Order History
        </button>
      </div>

      <div>
        {activeTab === 'details' && <MyDetails profile={loggedIn ? profile : null} />}
        {activeTab === 'orders' && <OrderHistory loggedIn={loggedIn} />}
      </div>
    </div>
  );
};

export default ProfilePage;
