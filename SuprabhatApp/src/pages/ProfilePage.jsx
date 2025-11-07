// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMyProfile } from '../api/users';
import { fetchMyOrders } from '../api/orders';
import { useRoute } from '@react-navigation/native';
import { styled } from 'nativewind';
import LoadingSpinner from '../components/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const MyDetails = ({ profile }) => (
  <StyledView className="bg-white p-6 rounded-lg shadow-sm">
    <StyledText className="text-xl font-semibold mb-4 text-gray-800">Account Details</StyledText>
    <StyledView className="space-y-2">
      <StyledText className="text-gray-700"><StyledText className="font-bold">Name:</StyledText> {profile.name}</StyledText>
      <StyledText className="text-gray-700"><StyledText className="font-bold">Email:</StyledText> {profile.email}</StyledText>
      <StyledText className="text-gray-700"><StyledText className="font-bold">Joined:</StyledText> {new Date(profile.createdAt).toLocaleDateString()}</StyledText>
    </StyledView>
  </StyledView>
);

const OrderHistory = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <StyledText className="text-red-500 p-4">Could not fetch order history: {error.message}</StyledText>;

  const orders = data?.results || [];

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Processing': 'bg-indigo-100 text-indigo-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Payment Failed': 'bg-gray-100 text-gray-800',
  };

  return (
    <StyledView className="bg-white p-6 rounded-lg shadow-sm">
      <StyledText className="text-xl font-semibold mb-4 text-gray-800">Your Orders</StyledText>
      {orders.length === 0 ? (
        <StyledText className="text-gray-500">You haven't placed any orders yet.</StyledText>
      ) : (
        <StyledView className="space-y-4">
          {orders.map(order => (
            <StyledView key={order._id} className="border border-gray-200 p-4 rounded-md">
              <StyledView className="flex-row justify-between items-center">
                <StyledText className="font-bold text-gray-900">Order #{order._id.slice(-6)}</StyledText>
                <StyledText className={`px-2 py-1 text-sm rounded-full ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                  {order.orderStatus}
                </StyledText>
              </StyledView>
              <StyledText className="text-sm text-gray-600 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</StyledText>
              <StyledText className="mt-2 font-semibold text-gray-900">Total: ₹{order.totalAmount.toFixed(2)}</StyledText>
              <StyledView className="text-sm text-gray-700 mt-2">
                <StyledText className="font-medium">Items:</StyledText>
                <StyledView className="ml-4">
                  {order.items.map(item => (
                    <StyledText key={item._id} className="text-gray-700">• {item.productId?.name || item.name} (x{item.quantity}) - ₹{item.price.toFixed(2)} each</StyledText>
                  ))}
                </StyledView>
              </StyledView>
              <StyledText className="text-sm text-gray-600 mt-2">Delivery Address: {order.deliveryAddress}</StyledText>
            </StyledView>
          ))}
        </StyledView>
      )}
    </StyledView>
  );
};


const ProfilePage = () => {
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <StyledText className="text-red-500 text-center p-10">Error loading profile: {error.message}. Please try logging in again.</StyledText>;

  return (
    <StyledScrollView contentContainerClassName="flex-grow px-6 py-8 bg-brand-beige">
      <StyledText className="text-3xl font-bold text-gray-800 mb-6">Your Profile</StyledText>

      {/* Tabs Navigation */}
      <StyledView className="flex-row border-b border-gray-200 mb-6">
        <StyledTouchableOpacity
          onPress={() => setActiveTab('details')}
          className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'border-b-2 border-brand-green' : 'border-b-2 border-transparent'}`}
        >
          <StyledText className={`${activeTab === 'details' ? 'text-brand-green' : 'text-gray-500'}`}>My Details</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={() => setActiveTab('orders')}
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-brand-green' : 'border-b-2 border-transparent'}`}
        >
          <StyledText className={`${activeTab === 'orders' ? 'text-brand-green' : 'text-gray-500'}`}>Order History</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Tab Content */}
      <StyledView>
        {activeTab === 'details' && <MyDetails profile={profile} />}
        {activeTab === 'orders' && <OrderHistory />}
      </StyledView>
    </StyledScrollView>
  );
};

export default ProfilePage;