import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../api/products';
import { useCartStore } from '../../store/cartStore';
import { COLORS, SIZES } from '../../constants/themes';

const ProductsScreen = () => {
  const { addToCart } = useCartStore();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const ProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>₹{item.price} / {item.unit}</Text>
      <Text style={item.stock > 0 ? styles.inStock : styles.outOfStock}>
        {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
      </Text>
      <TouchableOpacity
        onPress={() => addToCart(item)}
        disabled={item.stock === 0}
        style={[styles.addButton, item.stock === 0 && styles.disabledButton]}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (isError) {
    return <Text style={styles.centered}>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={data?.results || []}
      renderItem={ProductItem}
      keyExtractor={(item) => item._id}
      numColumns={2}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
          <View>
              <Text style={styles.title}>All Products</Text>
              <Text style={styles.subtitle}>Browse our hand-picked selection.</Text>
          </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: SIZES.small, backgroundColor: COLORS.brandBeige },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', textAlign: 'center', margin: SIZES.medium, color: COLORS.brandText },
  subtitle: { fontSize: SIZES.medium, textAlign: 'center', marginBottom: SIZES.medium, color: COLORS.gray },
  productCard: { flex: 1, margin: SIZES.small, backgroundColor: COLORS.white, borderRadius: SIZES.base, padding: SIZES.small, alignItems: 'center' },
  productImage: { width: '100%', height: 120, borderRadius: SIZES.base },
  productName: { fontWeight: '600', marginTop: SIZES.base, fontSize: SIZES.medium },
  productPrice: { color: COLORS.gray, marginVertical: SIZES.base / 2 },
  inStock: { color: 'green' },
  outOfStock: { color: 'red' },
  addButton: { backgroundColor: COLORS.brandGreen, padding: SIZES.small, borderRadius: 5, width: '100%', alignItems: 'center', marginTop: SIZES.base },
  disabledButton: { backgroundColor: COLORS.gray },
  addButtonText: { color: COLORS.white, fontWeight: 'bold' },
});

export default ProductsScreen;