// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import {NativeWindStyleSheet} from "nativewind"

// Import store
import { useAuthStore } from './src/store/authStore';
import { useCartStore } from './src/store/cartStore';

// Import pages
import HomePage from './src/pages/HomePage';
import ProductsPage from './src/pages/ProductsPage';
import CartPage from './src/pages/CartPage';
import AuthPage from './src/pages/AuthPage';
import ProfilePage from './src/pages/ProfilePage';
import AboutPage from './src/pages/AboutPage';
import ContactPage from './src/pages/ContactPage';
import CheckoutPage from './src/pages/CheckoutPage';
import ProductManagementPage from './src/pages/admin/ProductManagementPage';
import OrderManagementPage from './src/pages/admin/OrderManagementPage';

// Import components (for custom headers or screen content)
import { CustomHeader } from './src/components/HeaderFooterWrapper'; // Footer is embedded in pages now

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

NativeWindStyleSheet.setOutput({
  default: "native"
})

const queryClient = new QueryClient();

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();
const AdminTab = createBottomTabNavigator();

// Define color palette from tailwind.config.js for direct use in navigation
const colors = {
  'brand-green': '#2a623d',
  'brand-green-light': '#3a8654',
  'brand-beige': '#f5f5dc',
  'brand-text': '#3a3a3a',
  'brand-accent': '#ff8c42',
};

// Admin Tab Navigator (replaces AdminLayout's tab-like navigation)
const AdminTabNavigator = () => {
  return (
    <AdminTab.Navigator
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
        tabBarActiveTintColor: colors['brand-green'],
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: colors['brand-beige'] },
        headerShown: false, // Hide header here, as screens will have their own
      })}
    >
      <AdminTab.Screen name="Products" component={ProductManagementPage} options={{ title: 'Products' }} />
      <AdminTab.Screen name="Orders" component={OrderManagementPage} options={{ title: 'Orders' }} />
    </AdminTab.Navigator>
  );
};


// Main Application Stack Navigator for authenticated users
const AppStackNavigator = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  return (
    <AppStack.Navigator
      screenOptions={{
        header: (props) => <CustomHeader {...props} totalCartItems={totalItems} />, // Use custom header
        contentStyle: { backgroundColor: colors['brand-beige'] }, // Apply background to screen content
      }}
    >
      <AppStack.Screen name="Home" component={HomePage} options={{ headerShown: false }} /> {/* Home might have custom hero, so hide nav header */}
      <AppStack.Screen name="Products" component={ProductsPage} options={{ title: 'Our Products' }} />
      <AppStack.Screen name="Cart" component={CartPage} options={{ title: 'Your Cart' }} />
      <AppStack.Screen name="Checkout" component={CheckoutPage} options={{ title: 'Checkout' }} />
      <AppStack.Screen name="Profile" component={ProfilePage} options={{ title: 'My Profile' }} />
      <AppStack.Screen name="About" component={AboutPage} options={{ title: 'About Us' }} />
      <AppStack.Screen name="Contact" component={ContactPage} options={{ title: 'Contact Us' }} />
    </AppStack.Navigator>
  );
};

// Root App component
function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={colors['brand-green']} />
        {isAuthenticated ? (
          user?.role === 'admin' ? (
            <AdminStack.Navigator
              screenOptions={{
                headerShown: false, // AdminTabNavigator handles its own header
              }}
            >
              <AdminStack.Screen name="Admin" component={AdminTabNavigator} />
            </AdminStack.Navigator>
          ) : (
            <AppStackNavigator />
          )
        ) : (
          <AuthStack.Navigator
            screenOptions={{
              header: (props) => <CustomHeader {...props} />, // Use custom header for AuthStack as well
              contentStyle: { backgroundColor: colors['brand-beige'] },
            }}
          >
            <AuthStack.Screen
              name="Login"
              component={AuthPage}
              options={{ title: 'Login / Register' }}
            />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;