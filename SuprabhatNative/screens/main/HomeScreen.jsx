import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../api/products';
import { useCartStore } from '../../store/cartStore';
import { COLORS, SIZES } from '../../constants/themes';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const { addToCart } = useCartStore();
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const featured = data?.results?.slice(0, 4) || [];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Text style={styles.heroTitle}>Pure, Simple, Farm-Fresh.</Text>
        <Text style={styles.heroSubtitle}>
          Experience the true taste of nature with produce sourced from local farms.
        </Text>
        <TouchableOpacity 
          style={styles.heroButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.heroButtonText}>Explore Products</Text>
          <Ionicons name="arrow-forward-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Freshest Picks</Text>
        <View style={styles.featuredGrid}>
          {isLoading ? <Text>Loading...</Text> : featured.map(product => (
            <View key={product._id} style={styles.productCard}>
              <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>₹{product.price} / {product.unit}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={[styles.section, {backgroundColor: COLORS.white}]}>
        <Text style={styles.sectionTitle}>Loved by Our Community</Text>
        <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>"The quality is just incredible. My salads have never tasted better! Truly a game-changer."</Text>
            <Text style={styles.testimonialAuthor}>- Anjali P.</Text>
        </View>
        <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>"Reliable, fresh, and always delivered with a smile. Suprabhat is an essential part of my week."</Text>
            <Text style={styles.testimonialAuthor}>- Rohan M.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.brandBeige },
    heroContainer: { backgroundColor: COLORS.brandGreen, padding: SIZES.xl, alignItems: 'center' },
    heroTitle: { color: COLORS.white, fontSize: SIZES.xxl, fontWeight: 'bold', textAlign: 'center' },
    heroSubtitle: { color: '#e0e0e0', fontSize: SIZES.medium, textAlign: 'center', marginTop: SIZES.base },
    heroButton: { flexDirection: 'row', backgroundColor: COLORS.brandAccent, paddingVertical: SIZES.small, paddingHorizontal: SIZES.large, borderRadius: 50, marginTop: SIZES.large, alignItems: 'center' },
    heroButtonText: { color: COLORS.white, fontWeight: 'bold', marginRight: SIZES.base },
    section: { padding: SIZES.medium },
    sectionTitle: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.brandText, marginBottom: SIZES.medium, textAlign: 'center' },
    featuredGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    productCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: SIZES.base, padding: SIZES.small, marginBottom: SIZES.medium, alignItems: 'center' },
    productImage: { width: '100%', height: 120, borderRadius: SIZES.base },
    productName: { fontWeight: '600', marginTop: SIZES.base },
    productPrice: { color: COLORS.gray, marginVertical: SIZES.base / 2 },
    addButton: { backgroundColor: COLORS.brandGreen, padding: SIZES.small, borderRadius: 5, width: '100%', alignItems: 'center' },
    addButtonText: { color: COLORS.white, fontWeight: 'bold' },
    testimonialCard: { backgroundColor: COLORS.brandBeige, padding: SIZES.medium, borderRadius: SIZES.base, marginBottom: SIZES.small },
    testimonialText: { fontStyle: 'italic', color: COLORS.brandText },
    testimonialAuthor: { fontWeight: 'bold', textAlign: 'right', marginTop: SIZES.base, color: COLORS.brandGreen }
});

export default HomeScreen;