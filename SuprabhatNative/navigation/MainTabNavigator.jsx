import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from '../screens/main/HomeScreen';
import ProductsScreen from '../screens/main/ProductsScreen';
import CartScreen from '../screens/main/CartScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import AboutScreen from '../screens/main/AboutScreen';
import ContactScreen from '../screens/main/ContactScreen';

// Import Admin Screens for admin users
import AdminNavigator from './AdminNavigator'; 

import { COLORS } from '../constants/themes';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore'; // <-- NEW: Import the cart store

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => {
    const { user } = useAuthStore();
    const { items } = useCartStore(); // <-- NEW: Get items from the cart store
    const isAdmin = user?.role === 'admin';
    const cartProductCount = items.length; // <-- NEW: Calculate the number of unique products

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true, // You can customize headers per screen
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Products') iconName = focused ? 'apps' : 'apps-outline';
                    else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
                    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
                    else if (route.name === 'Admin') iconName = focused ? 'cog' : 'cog-outline';
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.brandGreen,
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Products" component={ProductsScreen} />
            {/* NEW: Added options prop to the Cart screen to show the badge */}
            <Tab.Screen 
                name="Cart" 
                component={CartScreen} 
                options={{ 
                    tabBarBadge: cartProductCount > 0 ? cartProductCount : null,
                    tabBarBadgeStyle: { backgroundColor: COLORS.brandAccent }
                }} 
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            {isAdmin && <Tab.Screen name="Admin" component={AdminNavigator} options={{ headerShown: false }} />}
        </Tab.Navigator>
    );
};

// This Stack Navigator includes all the main user-facing screens
const MainTabNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
        </Stack.Navigator>
    );
};

export default MainTabNavigator;