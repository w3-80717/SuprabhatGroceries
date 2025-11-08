import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllProductsAdmin, createProduct, updateProduct, deleteProduct, togglePublishStatus } from '../../api/admin';
import ProductForm from '../../components/admin/ProductForm';
import { COLORS, SIZES } from '../../constants/themes';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductManagementScreen = () => {
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
    onError: (error) => {
      Alert.alert("Error", error.response?.data?.message || "An unexpected error occurred.");
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
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(productId) }
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

  const renderProduct = ({ item }) => (
    <View style={[styles.productItem, item.isDeleted && styles.deletedItem]}>
      <View style={{flex: 1}}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text>₹{item.price} / {item.unit} - Stock: {item.stock}</Text>
        <Text style={item.isPublished ? styles.published : styles.unpublished}>
            {item.isDeleted ? 'Deleted' : item.isPublished ? 'Published' : 'Unpublished'}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        {!item.isDeleted && (
            <>
                <TouchableOpacity onPress={() => handleTogglePublish(item)}>
                    <Ionicons name={item.isPublished ? "eye-off-outline" : "eye-outline"} size={24} color={COLORS.brandGreen} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Ionicons name="pencil-outline" size={24} color={COLORS.brandAccent} />
                </TouchableOpacity>
            </>
        )}
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Ionicons name="trash-outline" size={24} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add-circle-outline" size={22} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      <Modal visible={isModalOpen} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</Text>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
          />
        </SafeAreaView>
      </Modal>

      {isLoading ? <ActivityIndicator size="large" /> : isError ? <Text>Error fetching products.</Text> : (
        <FlatList
          data={data?.results || []}
          renderItem={renderProduct}
          keyExtractor={item => item._id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: SIZES.small, backgroundColor: COLORS.brandBeige },
    addButton: { flexDirection: 'row', backgroundColor: COLORS.brandGreen, padding: SIZES.medium, borderRadius: SIZES.base, alignItems: 'center', justifyContent: 'center', margin: SIZES.small },
    addButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: SIZES.medium, marginLeft: SIZES.base },
    modalContainer: { flex: 1, padding: SIZES.medium },
    modalTitle: { fontSize: SIZES.xl, fontWeight: 'bold', marginBottom: SIZES.medium },
    productItem: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SIZES.medium, marginVertical: SIZES.base, borderRadius: SIZES.base, alignItems: 'center' },
    deletedItem: { opacity: 0.5, backgroundColor: '#f0f0f0' },
    productName: { fontSize: SIZES.medium, fontWeight: 'bold' },
    published: { color: 'green', fontStyle: 'italic' },
    unpublished: { color: COLORS.gray, fontStyle: 'italic' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});

export default ProductManagementScreen;