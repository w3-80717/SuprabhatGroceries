// src/components/AdminLayout.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { styled } from 'nativewind';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProductManagementPage from '../pages/admin/ProductManagementPage';
import OrderManagementPage from '../pages/admin/OrderManagementPage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Tab = createBottomTabNavigator();

const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigation = useNavigation();
  // const route = useRoute(); // Not directly used here, but kept for context

  if (!isAuthenticated || user?.role !== 'admin') {
    Alert.alert("Access Denied", "You must be logged in as an admin to view this page.", [
      { text: "OK", onPress: () => navigation.navigate('Login') }
    ]);
    return null;
  }

  return (
    <StyledView className="flex-1 bg-brand-beige">
      <StyledView className="px-6 py-4 bg-white shadow-sm">
        <StyledText className="text-3xl font-bold text-brand-green">Admin Dashboard</StyledText>
      </StyledView>
      {/* The Tab Navigator children are rendered by the parent (App.js) */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Products') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Orders') {
              iconName = focused ? 'list-circle' : 'list-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2a623d',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#f5f5dc' },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Products" component={ProductManagementPage} options={{ title: 'Products' }} />
        <Tab.Screen name="Orders" component={OrderManagementPage} options={{ title: 'Orders' }} />
      </Tab.Navigator>
    </StyledView>
  );
};

export default AdminLayout;