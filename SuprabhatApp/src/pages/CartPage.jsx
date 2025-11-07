// src/pages/CartPage.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const CartPage = () => {
  const {
    items = [],
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigation = useNavigation();

  const DELIVERY_FEE = 50;

  const totalPrice = (typeof getTotalPrice === 'function')
    ? getTotalPrice()
    : items.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 0)), 0);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please log in to proceed to checkout.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate('Login', { from: 'Cart' }) }
        ]
      );
    } else {
      navigation.navigate('Checkout');
    }
  };

  return (
    <StyledScrollView contentContainerClassName="flex-grow px-6 py-8 bg-brand-beige">
      <StyledText className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</StyledText>

      {items.length === 0 ? (
        <StyledView className="bg-white p-6 rounded-lg shadow-sm">
          <StyledText className="text-gray-500 text-base mb-4">Your cart is currently empty.</StyledText>
          <StyledTouchableOpacity
            onPress={() => navigation.navigate('Products')}
            className="mt-4 inline-block bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-brand-green-light"
          >
            <StyledText className="text-white text-center font-semibold">Start Shopping</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <StyledView className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <StyledView className="flex-1 space-y-4">
            {items.map(({ product, quantity }) => (
              <StyledView
                key={product._id ?? product.id}
                className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Info */}
                <StyledView className="flex flex-row items-center gap-4">
                  <StyledView className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                    <StyledImage
                      source={product.images?.[0] ? { uri: product.images[0] } : require('../../assets/images/tomato.jpeg')}
                      className="object-cover w-full h-full"
                    />
                  </StyledView>
                  <StyledView>
                    <StyledText className="text-lg font-semibold">{product?.name}</StyledText>
                    <StyledText className="text-gray-600">₹{(product?.price ?? 0).toFixed(2)}</StyledText>
                    {product?.unit && <StyledText className="text-sm text-gray-500">/ {product.unit}</StyledText>}
                  </StyledView>
                </StyledView>

                {/* Quantity and Remove */}
                <StyledView className="flex flex-row items-center gap-4 self-end sm:self-center">
                  <StyledView className="flex flex-row items-center border border-gray-300 rounded-md">
                    <StyledTouchableOpacity
                      onPress={() => decrementQuantity?.(product._id ?? product.id)}
                      className="px-3 py-1"
                      accessibilityLabel="Decrease quantity"
                    >
                      <StyledText className="text-lg font-bold">-</StyledText>
                    </StyledTouchableOpacity>
                    <StyledText className="px-4 text-base">{quantity}</StyledText>
                    <StyledTouchableOpacity
                      onPress={() => incrementQuantity?.(product._id ?? product.id)}
                      className="px-3 py-1"
                      accessibilityLabel="Increase quantity"
                    >
                      <StyledText className="text-lg font-bold">+</StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                  <StyledTouchableOpacity
                    onPress={() => removeFromCart?.(product._id ?? product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <StyledText className="text-red-500 font-semibold">Remove</StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            ))}
          </StyledView>

          {/* Order Summary */}
          <StyledView className="w-full lg:w-1/3">
            <StyledView className="bg-white p-6 rounded-lg shadow-sm">
              <StyledText className="text-xl font-semibold mb-4">Order Summary</StyledText>
              <StyledView className="flex flex-row justify-between mb-2">
                <StyledText>Subtotal</StyledText>
                <StyledText>₹{totalPrice.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="flex flex-row justify-between mb-4">
                <StyledText>Delivery Fee</StyledText>
                <StyledText>₹{DELIVERY_FEE.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="border-t border-gray-200 pt-4 mt-4 flex flex-row justify-between font-bold text-lg">
                <StyledText>Total</StyledText>
                <StyledText>₹{(totalPrice + DELIVERY_FEE).toFixed(2)}</StyledText>
              </StyledView>
              <StyledTouchableOpacity
                onPress={handleProceedToCheckout}
                className="mt-6 w-full bg-brand-green text-white py-2 rounded-lg hover:bg-brand-green-light"
              >
                <StyledText className="text-white text-center font-semibold">Proceed to Checkout</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      )}
    </StyledScrollView>
  );
};

export default CartPage;