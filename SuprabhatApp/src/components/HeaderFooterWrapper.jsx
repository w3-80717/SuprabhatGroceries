// src/components/HeaderFooterWrapper.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

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
  const headerTitle = options.headerTitle !== undefined ? options.headerTitle : options.title !== undefined ? options.title : route.name;

  return (
    <StyledView className="bg-white shadow-md z-20">
      {/* Main Header Bar */}
      <StyledView className="flex flex-row justify-between items-center px-4 py-3">
        {route.name !== 'Home' && currentNav.canGoBack() && (
          <StyledTouchableOpacity onPress={() => currentNav.goBack()} className="mr-2 p-1">
            <Ionicons name="arrow-back" size={24} color="#3a3a3a" />
          </StyledTouchableOpacity>
        )}
        <StyledTouchableOpacity onPress={() => currentNav.navigate('Home')} className="flex flex-row items-center flex-1">
          <StyledImage source={require('../../assets/images/suprabhaticon.png')} className="h-10 w-10 mr-2" />
          <StyledText className="text-xl font-bold text-brand-green">{headerTitle === 'Login / Register' ? 'Suprabhat' : headerTitle}</StyledText>
        </StyledTouchableOpacity>

        {/* Cart Icon & Mobile Menu Toggle */}
        <StyledView className="flex-row items-center">
          {isAuthenticated && (
            <StyledTouchableOpacity onPress={() => currentNav.navigate('Cart')} className="relative mr-4 p-1">
              <Ionicons name="cart-outline" size={24} color="#4a4a4a" />
              {totalItems > 0 && (
                <StyledView className="absolute -top-1 -right-2 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center">
                  <StyledText className="text-white text-xs">{totalItems}</StyledText>
                </StyledView>
              )}
            </StyledTouchableOpacity>
          )}

          <StyledTouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} className="p-1">
            {isMenuOpen ? <Feather name="x" size={24} color="#4a4a4a" /> : <Feather name="menu" size={24} color="#4a4a4a" />}
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <StyledView className="bg-white border-t border-gray-200 py-4 absolute w-full top-[60px] shadow-lg">
          <StyledTouchableOpacity onPress={() => { currentNav.navigate('Products'); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">Shop</StyledText></StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => { currentNav.navigate('About'); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">About</StyledText></StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => { currentNav.navigate('Contact'); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">Contact</StyledText></StyledTouchableOpacity>

          {isAdmin && (
            <StyledTouchableOpacity onPress={() => { currentNav.navigate('Admin'); setIsMenuOpen(false); }}>
              <StyledText className="font-bold text-brand-accent py-3 px-4">Admin Panel</StyledText>
            </StyledTouchableOpacity>
          )}

          <StyledView className="border-t border-gray-200 my-2"></StyledView>

          {isAuthenticated ? (
            <>
              <StyledTouchableOpacity onPress={() => { currentNav.navigate('Profile'); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">Profile</StyledText></StyledTouchableOpacity>
              <StyledTouchableOpacity onPress={() => { handleLogout(); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">Logout</StyledText></StyledTouchableOpacity>
            </>
          ) : (
            <StyledTouchableOpacity onPress={() => { currentNav.navigate('Login'); setIsMenuOpen(false); }} className="py-3 px-4"><StyledText className="text-gray-700 font-medium">Login</StyledText></StyledTouchableOpacity>
          )}
        </StyledView>
      )}
    </StyledView>
  );
};

const CustomFooter = () => {
  const navigation = useNavigation();
  return (
    <StyledView className="bg-brand-green text-green-100 mt-16 px-6 py-10">
      <StyledView className="flex flex-col md:flex-row gap-8"> {/* Adjusted for RN layout */}
        {/* Column 1: Brand Info */}
        <StyledView className="mb-6 flex-1">
          <StyledText className="text-xl font-bold text-white mb-4">Suprabhat</StyledText>
          <StyledText className="text-green-200">
            Your daily source for fresh, locally-sourced produce. Delivered with care, from our community to yours.
          </StyledText>
        </StyledView>

        {/* Column 2: Quick Links */}
        <StyledView className="mb-6 flex-1">
          <StyledText className="text-lg font-semibold text-white mb-4">Quick Links</StyledText>
          <StyledTouchableOpacity onPress={() => navigation.navigate('Products')} className="py-1"><StyledText className="text-green-200">Shop</StyledText></StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => navigation.navigate('About')} className="py-1"><StyledText className="text-green-200">About Us</StyledText></StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => navigation.navigate('Contact')} className="py-1"><StyledText className="text-green-200">Contact</StyledText></StyledTouchableOpacity>
          <StyledTouchableOpacity onPress={() => navigation.navigate('Profile')} className="py-1"><StyledText className="text-green-200">My Account</StyledText></StyledTouchableOpacity>
        </StyledView>

        {/* Column 3: Contact Info */}
        <StyledView className="mb-6 flex-1">
          <StyledText className="text-lg font-semibold text-white mb-4">Get in Touch</StyledText>
          <StyledText className="text-green-200">Pune, Maharashtra</StyledText>
          <StyledText className="text-green-200 mt-2">suprabhat.fresh@example.com</StyledText>
          <StyledText className="text-green-200 mt-2">+91 98765 43210</StyledText>
        </StyledView>

        {/* Column 4: Social Media */}
        <StyledView className="mb-6 flex-1">
          <StyledText className="text-lg font-semibold text-white mb-4">Follow Us</StyledText>
          <StyledView className="flex-row space-x-4">
            <Ionicons name="logo-instagram" size={24} color="#D1FAE5" />
            <Ionicons name="logo-facebook" size={24} color="#D1FAE5" />
            <Ionicons name="logo-whatsapp" size={24} color="#D1FAE5" />
          </StyledView>
        </StyledView>
      </StyledView>

      {/* Bottom Bar */}
      <StyledView className="border-t border-green-700 mt-8 pt-6 items-center">
        <StyledText className="text-green-200 text-sm">© {new Date().getFullYear()} Suprabhat. All Rights Reserved.</StyledText>
      </StyledView>
    </StyledView>
  );
};

export { CustomHeader, CustomFooter };
