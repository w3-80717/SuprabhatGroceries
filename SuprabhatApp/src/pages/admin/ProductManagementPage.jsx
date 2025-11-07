// src/pages/admin/ProductManagementPage.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct, togglePublishStatus } from '../../api/admin';
import Modal from '../../components/Modal';
import ProductForm from '../../components/ProductForm';
import Feather from 'react-native-vector-icons/Feather';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const ProductManagementPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allAdminProducts'],
    queryFn: fetchAllProductsAdmin,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAdminProducts'] });
      setIsModalOpen(false);
      setEditingProduct(null);
    },
    onError: (err) => {
      Alert.alert("Error", err.response?.data?.message || 'An unexpected error occurred.');
    }
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
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this product? It will be hidden from users but can be recovered later.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteMutation.mutate(productId) }
      ]
    );
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

  if (isLoading) return <StyledView className="text-center p-10"><ActivityIndicator size="large" color="#2a623d" /><StyledText>Loading Products...</StyledText></StyledView>;
  if (isError) return <StyledText className="text-center p-10 text-red-500">Error fetching products: {error.message}</StyledText>;

  const products = data?.results || [];

  return (
    <StyledScrollView contentContainerClassName="flex-grow px-6 py-8 bg-brand-beige">
      <StyledView className="flex-row justify-between items-center mb-6">
        <StyledText className="text-3xl font-bold text-gray-800">Product Management</StyledText>
        <StyledTouchableOpacity onPress={openAddModal} className="bg-brand-green hover:bg-brand-green-light text-white font-bold py-2 px-4 rounded-lg flex-row items-center gap-2">
          <Feather name="plus-circle" size={18} color="white" />
          <StyledText className="text-white font-bold">Add New Product</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} isLoading={createMutation.isLoading || updateMutation.isLoading} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <StyledView className="bg-white shadow-md rounded-lg overflow-hidden">
        {products.length === 0 ? (
          <StyledText className="p-4 text-gray-500 text-center">No products found.</StyledText>
        ) : (
          products.map(product => (
            <StyledView key={product._id} className={`flex-row items-center justify-between p-4 border-b border-gray-200 ${product.isDeleted ? 'opacity-40 bg-red-50' : ''}`}>
              <StyledView className="flex-1 mr-2">
                <StyledText className="font-medium text-gray-900">{product.name}</StyledText>
                <StyledText className="text-sm text-gray-500">₹{product.price} / {product.unit}</StyledText>
              </StyledView>
              <StyledView className="w-16 items-center mr-2">
                <StyledText className="text-sm text-gray-500">{product.stock}</StyledText>
              </StyledView>
              <StyledView className="w-24 items-center mr-2">
                {product.isDeleted ? (
                  <StyledText className="px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">Deleted</StyledText>
                ) : (
                  <StyledText className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {product.isPublished ? 'Published' : 'Unpublished'}
                  </StyledText>
                )}
              </StyledView>
              <StyledView className="flex-row items-center space-x-4">
                {!product.isDeleted && (
                  <>
                    <StyledTouchableOpacity onPress={() => handleTogglePublish(product)} className={product.isPublished ? 'text-yellow-500' : 'text-green-500'} accessibilityLabel={product.isPublished ? 'Unpublish' : 'Publish'}>
                      {product.isPublished ? <Feather name="eye-off" size={18} /> : <Feather name="eye" size={18} />}
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity onPress={() => openEditModal(product)} className="text-indigo-600" accessibilityLabel="Edit">
                      <Feather name="edit" size={18} />
                    </StyledTouchableOpacity>
                  </>
                )}
                <StyledTouchableOpacity onPress={() => handleDelete(product._id)} className="text-red-600" accessibilityLabel="Delete">
                  <Feather name="trash-2" size={18} />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          ))
        )}
      </StyledView>
    </StyledScrollView>
  );
};

export default ProductManagementPage;