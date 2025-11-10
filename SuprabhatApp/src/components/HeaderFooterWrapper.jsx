// src/components/HeaderFooterWrapper.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const CustomHeader = ({ navigation, route, options }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const currentNav = useNavigation();

  const handleLogout = () => {
    logout();
    currentNav.reset({
      index: 0,
      routes: [{ name: 'AuthStack', screen: 'Login' }],
    });
  };

  const isAdmin = user?.role === 'admin';
  const headerTitle =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  return (
    <View className="bg-white shadow-md z-20">
      {/* Main Header Bar */}
      <View className="flex flex-row justify-between items-center px-4 py-3">
        {route.name !== 'Home' && currentNav.canGoBack() && (
          <TouchableOpacity onPress={() => currentNav.goBack()} className="mr-2 p-1">
            <Ionicons name="arrow-back" size={24} color="#3a3a3a" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => currentNav.navigate('Home')}
          className="flex flex-row items-center flex-1"
        >
          <Image
            source={require('../../assets/images/suprabhaticon.png')}
            className="h-10 w-10 mr-2"
          />
          <Text className="text-xl font-bold text-brand-green">
            {headerTitle === 'Login / Register' ? 'Suprabhat' : headerTitle}
          </Text>
        </TouchableOpacity>

        {/* Cart Icon & Mobile Menu Toggle */}
        <View className="flex-row items-center">
          {isAuthenticated && (
            <TouchableOpacity
              onPress={() => currentNav.navigate('Cart')}
              className="relative mr-4 p-1"
            >
              <Ionicons name="cart-outline" size={24} color="#4a4a4a" />
              {totalItems > 0 && (
                <View className="absolute -top-1 -right-2 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center">
                  <Text className="text-white text-xs">{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} className="p-1">
            {isMenuOpen ? (
              <Feather name="x" size={24} color="#4a4a4a" />
            ) : (
              <Feather name="menu" size={24} color="#4a4a4a" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <View className="bg-white border-t border-gray-200 py-4 absolute w-full top-[60px] shadow-lg">
          <TouchableOpacity
            onPress={() => {
              currentNav.navigate('Products');
              setIsMenuOpen(false);
            }}
            className="py-3 px-4"
          >
            <Text className="text-gray-700 font-medium">Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              currentNav.navigate('About');
              setIsMenuOpen(false);
            }}
            className="py-3 px-4"
          >
            <Text className="text-gray-700 font-medium">About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              currentNav.navigate('Contact');
              setIsMenuOpen(false);
            }}
            className="py-3 px-4"
          >
            <Text className="text-gray-700 font-medium">Contact</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              onPress={() => {
                currentNav.navigate('Admin');
                setIsMenuOpen(false);
              }}
            >
              <Text className="font-bold text-brand-accent py-3 px-4">Admin Panel</Text>
            </TouchableOpacity>
          )}

          <View className="border-t border-gray-200 my-2" />

          {isAuthenticated ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  currentNav.navigate('Profile');
                  setIsMenuOpen(false);
                }}
                className="py-3 px-4"
              >
                <Text className="text-gray-700 font-medium">Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="py-3 px-4"
              >
                <Text className="text-gray-700 font-medium">Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => {
                currentNav.navigate('Login');
                setIsMenuOpen(false);
              }}
              className="py-3 px-4"
            >
              <Text className="text-gray-700 font-medium">Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const CustomFooter = () => {
  const navigation = useNavigation();

  return (
    <View className="bg-brand-green text-green-100 mt-16 px-6 py-10">
      <View className="flex flex-col md:flex-row gap-8">
        {/* Column 1: Brand Info */}
        <View className="mb-6 flex-1">
          <Text className="text-xl font-bold text-white mb-4">Suprabhat</Text>
          <Text className="text-green-200">
            Your daily source for fresh, locally-sourced produce. Delivered with care, from our community to yours.
          </Text>
        </View>

        {/* Column 2: Quick Links */}
        <View className="mb-6 flex-1">
          <Text className="text-lg font-semibold text-white mb-4">Quick Links</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')} className="py-1">
            <Text className="text-green-200">Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('About')} className="py-1">
            <Text className="text-green-200">About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Contact')} className="py-1">
            <Text className="text-green-200">Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} className="py-1">
            <Text className="text-green-200">My Account</Text>
          </TouchableOpacity>
        </View>

        {/* Column 3: Contact Info */}
        <View className="mb-6 flex-1">
          <Text className="text-lg font-semibold text-white mb-4">Get in Touch</Text>
          <Text className="text-green-200">Pune, Maharashtra</Text>
          <Text className="text-green-200 mt-2">suprabhat.fresh@example.com</Text>
          <Text className="text-green-200 mt-2">+91 98765 43210</Text>
        </View>

        {/* Column 4: Social Media */}
        <View className="mb-6 flex-1">
          <Text className="text-lg font-semibold text-white mb-4">Follow Us</Text>
          <View className="flex-row space-x-4">
            <Ionicons name="logo-instagram" size={24} color="#D1FAE5" />
            <Ionicons name="logo-facebook" size={24} color="#D1FAE5" />
            <Ionicons name="logo-whatsapp" size={24} color="#D1FAE5" />
          </View>
        </View>
      </View>

      {/* Bottom Bar */}
      <View className="border-t border-green-700 mt-8 pt-6 items-center">
        <Text className="text-green-200 text-sm">
          © {new Date().getFullYear()} Suprabhat. All Rights Reserved.
        </Text>
      </View>
    </View>
  );
};

export { CustomHeader, CustomFooter };
