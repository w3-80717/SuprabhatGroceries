import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct } from '@/api/admin.js';
import Modal from '@/components/Modal.jsx';
import ProductForm from '@/components/ProductForm.jsx';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Query to fetch all products for the admin view
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allAdminProducts'],
    queryFn: fetchAllProductsAdmin,
  });

  // Mutation for creating a product
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['allAdminProducts']);
      setIsModalOpen(false);
    },
  });

  // Mutation for updating a product
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['allAdminProducts']);
      setIsModalOpen(false);
      setEditingProduct(null);
    },
  });

  // Mutation for deleting a product (soft delete)
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['allAdminProducts']);
    },
  });

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      updateMutation.mutate({ productId: editingProduct._id, updateData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDelete = (productId) => {
    if (window.confirm('This will un-publish the product, making it invisible to customers. Are you sure?')) {
      deleteMutation.mutate(productId);
    }
  };

  if (isLoading) return <div className="text-center p-10">Loading Products...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Error fetching products.</div>;

  const products = data?.results || [];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button onClick={openAddModal} className="bg-brand-green hover:bg-brand-green-light text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <FiPlusCircle /> Add New Product
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price} / {product.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900"><FiEdit /></button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagementPage;