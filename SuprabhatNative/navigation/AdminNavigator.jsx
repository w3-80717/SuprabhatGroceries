import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Admin Screens
import ProductManagementScreen from '../screens/admin/ProductManagementScreen';
import OrderManagementScreen from '../screens/admin/OrderManagementScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductManagement" 
        component={ProductManagementScreen} 
        options={{ title: 'Product Management' }} 
      />
      <Stack.Screen 
        name="OrderManagement" 
        component={OrderManagementScreen} 
        options={{ title: 'Order Management' }} 
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;