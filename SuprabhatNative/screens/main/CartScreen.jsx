import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SIZES } from '../../constants/themes';

const CartScreen = ({ navigation }) => {
  const { items, removeFromCart, incrementQuantity, decrementQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const totalPrice = getTotalPrice();
  const DELIVERY_FEE = 50;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // In a real app, you might want a modal or a more explicit redirect message
      navigation.navigate('Profile'); // Redirecting to profile tab which can handle auth
    } else {
      navigation.navigate('Checkout');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.product.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>₹{item.product.price.toFixed(2)}</Text>
         <TouchableOpacity onPress={() => removeFromCart(item.product._id)} style={styles.removeButton}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decrementQuantity(item.product._id)} style={styles.quantityButton}>
          <Text style={styles.quantityOp}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => incrementQuantity(item.product._id)} style={styles.quantityButton}>
          <Text style={styles.quantityOp}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Products')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product._id}
        ListHeaderComponent={<Text style={styles.title}>Your Shopping Cart</Text>}
        contentContainerStyle={{ paddingBottom: 200 }} // Ensure list doesn't hide behind summary
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹{totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Fee</Text>
          <Text>₹{DELIVERY_FEE.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹{(totalPrice + DELIVERY_FEE).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.brandBeige },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: SIZES.large, color: COLORS.gray },
    shopButton: { backgroundColor: COLORS.brandGreen, padding: SIZES.medium, borderRadius: 8, marginTop: SIZES.large },
    shopButtonText: { color: COLORS.white, fontSize: SIZES.medium, fontWeight: 'bold' },
    title: { fontSize: SIZES.xxl, fontWeight: 'bold', margin: SIZES.medium, color: COLORS.brandText, textAlign: 'center' },
    itemContainer: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SIZES.medium, marginHorizontal: SIZES.medium, marginBottom: SIZES.base, borderRadius: 8, alignItems: 'center' },
    productImage: { width: 60, height: 60, borderRadius: 8 },
    itemDetails: { flex: 1, marginLeft: SIZES.medium },
    itemName: { fontSize: SIZES.large, fontWeight: '600' },
    itemPrice: { color: COLORS.gray, marginVertical: 4 },
    removeButton: { marginTop: 4 },
    removeText: { color: COLORS.red, fontSize: SIZES.small },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    quantityButton: { paddingHorizontal: SIZES.medium, paddingVertical: SIZES.small },
    quantityOp: { fontSize: SIZES.large },
    quantityText: { fontSize: SIZES.medium, paddingHorizontal: SIZES.small },
    summaryContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SIZES.medium, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: '#e0e0e0' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base },
    totalRow: { borderTopWidth: 1, borderColor: '#e0e0e0', paddingTop: SIZES.base, marginTop: SIZES.base, flexDirection: 'row', justifyContent: 'space-between' },
    totalText: { fontSize: SIZES.large, fontWeight: 'bold' },
    checkoutButton: { backgroundColor: COLORS.brandGreen, padding: SIZES.medium, borderRadius: 8, alignItems: 'center', marginTop: SIZES.medium },
    checkoutButtonText: { color: COLORS.white, fontSize: SIZES.medium, fontWeight: 'bold' },
});

export default CartScreen;