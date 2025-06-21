import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';

const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-brand-green mb-4">Admin Dashboard</h1>
      <div className="flex border-b mb-6">
        <Link to="/admin/products" className="py-2 px-4 font-medium text-gray-600 hover:text-brand-green border-b-2 border-transparent hover:border-brand-green">Product Management</Link>
        {/* <Link to="/admin/orders" className="...">Order Management</Link> */}
      </div>
      <Outlet />
    </div>
  );
};
export default AdminLayout;