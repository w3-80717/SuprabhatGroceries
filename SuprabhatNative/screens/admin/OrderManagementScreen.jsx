import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllOrdersAdmin, updateOrderStatus } from '../../api/admin';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SIZES } from '../../constants/themes';

const OrderManagementScreen = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAllOrdersAdmin,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      Alert.alert('Success', 'Order status updated!');
    },
    onError: (err) => {
      Alert.alert('Error', err.response?.data?.message || 'Could not update status.');
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text>Customer: {item.user?.name || 'N/A'}</Text>
        <Text>Address: {item.deliveryAddress}</Text>
      </View>
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Items:</Text>
        {item.items.map(prod => (
            <Text key={prod._id}>- {prod.productId?.name || prod.name} (x{prod.quantity})</Text>
        ))}
      </View>
      <Text style={styles.totalAmount}>Total: ₹{item.totalAmount.toFixed(2)}</Text>
      <View style={styles.statusContainer}>
        <Text>Status: </Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={item.orderStatus}
                onValueChange={(itemValue) => handleStatusChange(item._id, itemValue)}
                style={{ flex: 1 }}
                enabled={!updateStatusMutation.isLoading}
            >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Confirmed" value="Confirmed" />
                <Picker.Item label="Processing" value="Processing" />
                <Picker.Item label="Out for Delivery" value="Out for Delivery" />
                <Picker.Item label="Delivered" value="Delivered" />
                <Picker.Item label="Cancelled" value="Cancelled" />
                <Picker.Item label="Payment Failed" value="Payment Failed" />
            </Picker>
        </View>
      </View>
    </View>
  );

  if (isLoading) return <ActivityIndicator size="large" style={styles.centered} />;
  if (isError) return <Text style={styles.centered}>Error fetching orders: {error.message}</Text>;

  return (
    <FlatList
      data={data?.results || []}
      renderItem={renderOrder}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: SIZES.small, backgroundColor: COLORS.brandBeige },
  orderCard: { backgroundColor: COLORS.white, padding: SIZES.medium, borderRadius: SIZES.base, marginBottom: SIZES.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: SIZES.small, marginBottom: SIZES.small },
  orderId: { fontWeight: 'bold', fontSize: SIZES.medium },
  customerInfo: { marginBottom: SIZES.small },
  itemsContainer: { marginVertical: SIZES.small },
  itemsTitle: { fontWeight: '600' },
  totalAmount: { fontWeight: 'bold', fontSize: SIZES.medium, textAlign: 'right', marginTop: SIZES.base },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.medium, borderWidth: 1, borderColor: '#ccc', borderRadius: SIZES.base },
  pickerContainer: { flex: 1 },
});

export default OrderManagementScreen;