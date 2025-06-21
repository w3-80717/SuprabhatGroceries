import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct, togglePublishStatus } from '@/api/admin.js';
import Modal from '@/components/Modal.jsx';
import ProductForm from '@/components/ProductForm.jsx';
import { FiEdit, FiTrash2, FiPlusCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allAdminProducts'],
    queryFn: fetchAllProductsAdmin,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAdminProducts'] });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
  };

  const createMutation = useMutation({ ...mutationOptions, mutationFn: createProduct });
  const updateMutation = useMutation({ ...mutationOptions, mutationFn: updateProduct });
  const deleteMutation = useMutation({ ...mutationOptions, mutationFn: deleteProduct });
  const publishMutation = useMutation({ ...mutationOptions, mutationFn: togglePublishStatus });

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      updateMutation.mutate({ productId: editingProduct._id, updateData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? It will be hidden from users but can be recovered later.')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleTogglePublish = (product) => {
    publishMutation.mutate({ productId: product._id, isPublished: !product.isPublished });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} isLoading={createMutation.isLoading || updateMutation.isLoading} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product._id} className={`hover:bg-gray-50 ${product.isDeleted ? 'opacity-40 bg-red-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">₹{product.price} / {product.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {product.isDeleted ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">Deleted</span>
                  ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {product.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  {!product.isDeleted && (
                    <>
                      <button onClick={() => handleTogglePublish(product)} className={product.isPublished ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'} title={product.isPublished ? 'Unpublish' : 'Publish'}>
                        {product.isPublished ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <FiEdit />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <FiTrash2 />
                  </button>
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