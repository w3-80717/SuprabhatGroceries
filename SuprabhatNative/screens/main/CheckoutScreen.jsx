import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../../api/orders';
import { COLORS, SIZES } from '../../constants/themes';

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Address must be at least 10 characters'),
});

const CheckoutScreen = ({ navigation }) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subTotal = getTotalPrice();
  const DELIVERY_FEE = 50;
  const totalAmount = subTotal + DELIVERY_FEE;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryAddress: user?.addresses?.[0] || '' },
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      Alert.alert(
        "Order Placed!",
        `Your order #${data._id.slice(-6)} has been placed successfully.`,
        [{ text: "OK", onPress: () => navigation.navigate('Profile', { activeTab: 'orders' }) }]
      );
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to place order.';
      Alert.alert("Order Error", errorMessage);
    },
  });

  const onSubmit = (formData) => {
    const orderItems = items.map(cartItem => ({
      productId: cartItem.product._id,
      quantity: cartItem.quantity,
    }));
    const orderPayload = {
      items: orderItems,
      deliveryAddress: formData.deliveryAddress,
    };
    createOrderMutation.mutate(orderPayload);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>
        {items.map(({ product, quantity }) => (
          <View key={product._id} style={styles.summaryRow}>
            <Text style={styles.summaryItem}>{product.name} (x{quantity})</Text>
            <Text>₹{(product.price * quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalText}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Delivery Information</Text>
        <Controller
          control={control}
          name="deliveryAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter your full delivery address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.deliveryAddress && <Text style={styles.errorText}>{errors.deliveryAddress.message}</Text>}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={createOrderMutation.isLoading}
      >
        {createOrderMutation.isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Place Order (₹{totalAmount.toFixed(2)})</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: SIZES.medium, backgroundColor: COLORS.brandBeige },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.base, padding: SIZES.medium, marginBottom: SIZES.medium },
  cardTitle: { fontSize: SIZES.large, fontWeight: 'bold', marginBottom: SIZES.small },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SIZES.base / 2 },
  summaryItem: { flex: 1 },
  totalRow: { borderTopWidth: 1, borderColor: '#eee', marginTop: SIZES.small, paddingTop: SIZES.small, flexDirection: 'row', justifyContent: 'space-between' },
  totalText: { fontWeight: 'bold', fontSize: SIZES.medium },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: SIZES.base, padding: SIZES.small, textAlignVertical: 'top' },
  errorText: { color: 'red', marginTop: SIZES.base },
  button: { backgroundColor: COLORS.brandGreen, padding: SIZES.medium, borderRadius: 8, alignItems: 'center', marginTop: SIZES.medium },
  buttonText: { color: COLORS.white, fontSize: SIZES.medium, fontWeight: 'bold' },
});

export default CheckoutScreen;