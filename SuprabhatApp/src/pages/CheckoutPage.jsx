// src/pages/CheckoutPage.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/orders';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Delivery address is required and must be at least 10 characters long'),
});

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigation = useNavigation();

  const DELIVERY_FEE = 50;
  const subTotal = getTotalPrice();
  const totalAmount = subTotal + DELIVERY_FEE;

  const { control, register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: user?.addresses?.[0] || '',
    },
  });

  React.useEffect(() => {
    register('deliveryAddress');
  }, [register]);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCart();
      Alert.alert(`Order #${data._id.slice(-6)} placed successfully!`, "Your order has been placed.", [
        { text: "OK", onPress: () => navigation.navigate('Profile', { screen: 'Profile', params: { activeTab: 'orders' } }) }
      ]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      Alert.alert('Order Error', errorMessage);
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        Alert.alert(
          "Login Required",
          "You need to be logged in to checkout.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => navigation.navigate('Login', { from: 'Checkout' }) }
          ]
        );
        navigation.goBack();
        return;
      }
      if (items.length === 0) {
        Alert.alert("Cart Empty", "Your cart is empty. Please add items to proceed.", [
          { text: "OK", onPress: () => navigation.navigate('Cart') }
        ]);
        navigation.goBack();
        return;
      }
    }, [isAuthenticated, items.length, navigation])
  );

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
    <StyledScrollView contentContainerClassName="flex-grow px-6 py-8 bg-brand-beige">
      <StyledText className="text-3xl font-bold text-gray-800 mb-6">Checkout</StyledText>

      <StyledView className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <StyledView className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <StyledText className="text-xl font-semibold mb-4">Order Summary</StyledText>
          <StyledView className="space-y-3">
            {items.map(({ product, quantity }) => (
              <StyledView key={product._id} className="flex flex-row justify-between items-center text-gray-700">
                <StyledText className="flex-grow text-base">{product.name} (x{quantity})</StyledText>
                <StyledText className="font-medium text-base">₹{(product.price * quantity).toFixed(2)}</StyledText>
              </StyledView>
            ))}
          </StyledView>
          <StyledView className="border-t border-gray-200 pt-4 mt-4 space-y-2">
            <StyledView className="flex flex-row justify-between">
              <StyledText>Subtotal</StyledText>
              <StyledText className="font-medium">₹{subTotal.toFixed(2)}</StyledText>
            </StyledView>
            <StyledView className="flex flex-row justify-between">
              <StyledText>Delivery Fee</StyledText>
              <StyledText className="font-medium">₹{DELIVERY_FEE.toFixed(2)}</StyledText>
            </StyledView>
            <StyledView className="flex flex-row justify-between font-bold text-lg text-brand-text mt-2">
              <StyledText>Total Amount</StyledText>
              <StyledText>₹{totalAmount.toFixed(2)}</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Delivery Details and Place Order */}
        <StyledView className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <StyledText className="text-xl font-semibold mb-4">Delivery Information</StyledText>
          <StyledView className="space-y-4"> {/* Changed to StyledView as form is handled by handleSubmit */}
            <StyledView>
              <StyledText className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</StyledText>
              <StyledTextInput
                onChangeText={(text) => setValue('deliveryAddress', text)}
                value={control._formValues.deliveryAddress}
                multiline
                numberOfLines={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
                placeholder="Enter your full delivery address"
              />
              {errors.deliveryAddress && <StyledText className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</StyledText>}
            </StyledView>

            {/* Payment Method - Placeholder for now */}
            <StyledView>
              <StyledText className="block text-sm font-medium text-gray-700">Payment Method</StyledText>
              <StyledView className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed">
                <Picker
                  selectedValue="Cash On Delivery"
                  onValueChange={() => {}}
                  enabled={false}
                  style={{ height: 50, width: '100%' }}
                >
                  <Picker.Item label="Cash On Delivery (Default)" value="Cash On Delivery" />
                </Picker>
              </StyledView>
              <StyledText className="text-sm text-gray-500 mt-1">More payment options coming soon!</StyledText>
            </StyledView>

            <StyledTouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={createOrderMutation.isLoading}
              className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-brand-green-light disabled:bg-gray-400 disabled:opacity-50 flex items-center justify-center"
            >
              {createOrderMutation.isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <StyledText className="text-white font-bold text-lg">{`Place Order (₹${totalAmount.toFixed(2)})`}</StyledText>
              )}
            </StyledTouchableOpacity>
            {createOrderMutation.isError && (
              <StyledText className="text-red-500 text-sm text-center">
                {createOrderMutation.error.response?.data?.message || 'An unexpected error occurred.'}
              </StyledText>
            )}
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
};

export default CheckoutPage;