// File: src/pages/admin/OrderManagementPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllOrdersAdmin, updateOrderStatus } from '@/api/admin.js';
import { FiRefreshCcw, FiCheckCircle, FiXCircle, FiTruck, FiClock, FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '@/components/LoadingSpinner.jsx'; // Assuming you have a LoadingSpinner component

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
  'Pending': <FiClock className="inline-block mr-1" />,
  'Confirmed': <FiCheckCircle className="inline-block mr-1" />,
  'Processing': <FiRefreshCcw className="inline-block mr-1" />,
  'Out for Delivery': <FiTruck className="inline-block mr-1" />,
  'Delivered': <FiCheckCircle className="inline-block mr-1" />,
  'Cancelled': <FiXCircle className="inline-block mr-1" />,
  'Payment Failed': <FiDollarSign className="inline-block mr-1" />,
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
      alert('Order status updated successfully!');
    },
    onError: (err) => {
      alert(`Error updating order status: ${err.response?.data?.message || 'An unexpected error occurred.'}`);
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to change order ${orderId.slice(-6)} status to ${newStatus}?`)) {
      updateStatusMutation.mutate({ orderId, status: newStatus });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="text-center p-10 text-red-500">Error fetching orders: {error.message}</div>;

  const orders = data?.results || [];

  const allOrderStatuses = [
    'Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed'
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h2>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.user?.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {order.items.map(item => (
                        <li key={item._id}>
                          {item.productId?.name || item.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.orderStatus]}`}>
                      {statusIcons[order.orderStatus]} {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updateStatusMutation.isLoading && updateStatusMutation.variables?.orderId === order._id}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-brand-green focus:border-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {allOrderStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;