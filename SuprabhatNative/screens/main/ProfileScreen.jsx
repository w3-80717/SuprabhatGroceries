import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { fetchMyProfile } from '../../api/users';
import { fetchMyOrders } from '../../api/orders';
import { COLORS, SIZES } from '../../constants/themes';

const MyDetails = ({ profile }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Account Details</Text>
      <Text>Name: {profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Joined: {new Date(profile.createdAt).toLocaleDateString()}</Text>
    </View>
);

const OrderHistory = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
    });

    if (isLoading) return <ActivityIndicator />;
    if (isError) return <Text>Could not fetch order history.</Text>;

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Orders</Text>
            {data.results.length === 0 ? <Text>No orders yet.</Text> : data.results.map(order => (
                <View key={order._id} style={styles.orderItem}>
                    <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text>
                    <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
                    <Text>Total: ₹{order.totalAmount.toFixed(2)}</Text>
                    <Text>Status: {order.orderStatus}</Text>
                </View>
            ))}
        </View>
    );
};

const ProfileScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { logout } = useAuthStore();
  
  // To switch tabs from other screens (e.g., after checkout)
  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
  });

  const handleLogout = () => {
    logout();
    // The AppNavigator will automatically handle the screen switch
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('details')} style={[styles.tab, activeTab === 'details' && styles.activeTab]}>
          <Text style={styles.tabText}>My Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('orders')} style={[styles.tab, activeTab === 'orders' && styles.activeTab]}>
          <Text style={styles.tabText}>Order History</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? <ActivityIndicator /> : (
        <>
            {activeTab === 'details' && <MyDetails profile={profile} />}
            {activeTab === 'orders' && <OrderHistory />}
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.brandBeige, padding: SIZES.medium },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', marginBottom: SIZES.medium, color: COLORS.brandText },
  tabContainer: { flexDirection: 'row', marginBottom: SIZES.medium },
  tab: { paddingVertical: SIZES.small, paddingHorizontal: SIZES.medium },
  activeTab: { borderBottomWidth: 2, borderColor: COLORS.brandGreen },
  tabText: { fontWeight: '600' },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.base, padding: SIZES.medium, marginBottom: SIZES.medium },
  cardTitle: { fontSize: SIZES.large, fontWeight: 'bold', marginBottom: SIZES.small },
  orderItem: { borderWidth: 1, borderColor: '#eee', padding: SIZES.small, borderRadius: 5, marginBottom: SIZES.small },
  orderId: { fontWeight: 'bold' },
  logoutButton: { backgroundColor: COLORS.red, padding: SIZES.medium, borderRadius: 8, alignItems: 'center', marginTop: SIZES.large },
  logoutButtonText: { color: COLORS.white, fontWeight: 'bold' },
});

export default ProfileScreen;