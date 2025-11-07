// src/pages/admin/OrderManagementPage.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllOrdersAdmin, updateOrderStatus } from '../../api/admin';
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoadingSpinner from '../../components/LoadingSpinner';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-indigo-100 text-indigo-800',
  'Out for Delivery': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Payment Failed': 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  'Pending': <Ionicons name="time-outline" size={14} className="mr-1" />,
  'Confirmed': <Ionicons name="checkmark-circle-outline" size={14} className="mr-1" />,
  'Processing': <Ionicons name="sync-outline" size={14} className="mr-1" />,
  'Out for Delivery': <Ionicons name="car-outline" size={14} className="mr-1" />,
  'Delivered': <Ionicons name="checkbox-outline" size={14} className="mr-1" />,
  'Cancelled': <Ionicons name="close-circle-outline" size={14} className="mr-1" />,
  'Payment Failed': <Ionicons name="card-outline" size={14} className="mr-1" />,
};

const OrderManagementPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAllOrdersAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      Alert.alert('Success', 'Order status updated successfully!');
    },
    onError: (err) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update order status.');
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    Alert.alert(
      "Confirm Status Change",
      `Are you sure you want to change order ${orderId.slice(-6)} status to ${newStatus}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => updateStatusMutation.mutate({ orderId, status: newStatus }) }
      ]
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <StyledText className="text-center p-10 text-red-500">Error fetching orders: {error.message}</StyledText>;

  const orders = data?.results || [];

  const allOrderStatuses = [
    'Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed'
  ];

  return (
    <StyledScrollView contentContainerClassName="flex-grow px-6 py-8 bg-brand-beige">
      <StyledText className="text-3xl font-bold text-gray-800 mb-6">Order Management</StyledText>

      {orders.length === 0 ? (
        <StyledView className="bg-white p-6 rounded-lg shadow-sm">
          <StyledText className="text-gray-500">No orders found.</StyledText>
        </StyledView>
      ) : (
        <StyledView className="bg-white shadow-md rounded-lg overflow-hidden">
          {orders.map(order => (
            <StyledView key={order._id} className="border-b border-gray-200 p-4 last:border-b-0">
              <StyledView className="flex-row justify-between items-center mb-2">
                <StyledText className="text-sm font-medium text-gray-900">
                  <StyledText className="font-bold">Order ID: </StyledText>#{order._id.slice(-6)}
                  <StyledText className="text-xs text-gray-500 block">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </StyledText>
                </StyledText>
                <StyledView className="flex-row items-center">
                  {updateStatusMutation.isLoading && updateStatusMutation.variables?.orderId === order._id ? (
                    <ActivityIndicator size="small" color="#2a623d" className="mr-2" />
                  ) : (
                    <StyledText className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${statusColors[order.orderStatus]}`}>
                      {statusIcons[order.orderStatus]} {order.orderStatus}
                    </StyledText>
                  )}
                </StyledView>
              </StyledView>

              <StyledText className="text-sm font-medium text-gray-900 mt-2">
                <StyledText className="font-bold">Customer: </StyledText>{order.user?.name || 'N/A'}
              </StyledText>
              <StyledText className="text-xs text-gray-500">{order.user?.email || 'N/A'}</StyledText>
              <StyledText className="text-xs text-gray-500">{order.user?.phone || 'N/A'}</StyledText>

              <StyledText className="mt-2 text-sm font-medium">Items:</StyledText>
              <StyledView className="ml-4">
                {order.items.map(item => (
                  <StyledText key={item._id} className="text-sm text-gray-700">
                    • {item.productId?.name || item.name} (x{item.quantity})
                  </StyledText>
                ))}
              </StyledView>

              <StyledText className="mt-2 text-sm font-medium text-gray-900">
                <StyledText className="font-bold">Total: </StyledText>₹{order.totalAmount.toFixed(2)}
              </StyledText>

              <StyledView className="mt-4">
                <StyledText className="text-xs font-medium text-gray-700 mb-1">Update Status:</StyledText>
                <StyledView className="border border-gray-300 rounded-md overflow-hidden">
                  <Picker
                    selectedValue={order.orderStatus}
                    onValueChange={(itemValue) => handleStatusChange(order._id, itemValue)}
                    enabled={!(updateStatusMutation.isLoading && updateStatusMutation.variables?.orderId === order._id)}
                    style={{ height: 40, width: '100%' }}
                    itemStyle={{ fontSize: 14 }}
                  >
                    {allOrderStatuses.map(status => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </StyledView>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>
      )}
    </StyledScrollView>
  );
};

export default OrderManagementPage;