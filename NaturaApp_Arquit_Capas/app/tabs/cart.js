import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useCart from
  '../../src/viewmodels/useCart';
import CartItemRow from
  '../../src/components/CartItemRow';
import { useTheme } from '../../src/services/ThemeContext';

export default function CartScreen() {
  const {
    items,
    total,
    loading,
    error,
    updateQuantity,
    removeItem,
    checkout,
    refresh,
  } = useCart();
  const { theme } = useTheme();
  const [address, setAddress] = useState('');
  const safeItems = Array.isArray(items) ? items : [];
  const safeTotal = Number(total) || 0;

  // Recargar carrito cada vez que se enfoca en la pantalla
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleCheckout = async () => {
    try {
      const order = await checkout(address);
      Alert.alert('Pedido Creado',
        `Pedido #${order.id} registrado.`);
      setAddress('');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const containerStyle = [styles.container, { backgroundColor: theme.background }];
  const titleStyle = [styles.title, { color: theme.text }];
  const inputStyle = [styles.addressInput, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }];
  const totalLabelStyle = [styles.totalLabel, { color: theme.text }];
  const totalValueStyle = [styles.totalValue, { color: theme.accent }];
  const emptyStyle = [styles.empty, { color: theme.secondaryText }];
  const errorStyle = [styles.error, { color: '#E74C3C' }];

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>
        Mi Carrito ({safeItems.length} items)
      </Text>

      {error ? (
        <Text style={errorStyle}>{error}</Text>
      ) : (
        <FlatList
          data={safeItems}
          keyExtractor={item =>
            item.productId.toString()}
          renderItem={({ item }) => (
            <CartItemRow
              item={item}
              onIncrease={() =>
                updateQuantity(
                  item.productId,
                  item.quantity + 1)}
              onDecrease={() =>
                updateQuantity(
                  item.productId,
                  item.quantity - 1)}
              onRemove={() =>
                removeItem(item.productId)}
            />
          )}
          ListEmptyComponent={
            <Text style={emptyStyle}>
              Tu carrito está vacío
            </Text>}
        />
      )}

      {safeItems.length > 0 && (
        <View style={styles.footer}>
          <TextInput
            style={inputStyle}
            placeholder='Dirección de entrega'
            placeholderTextColor={theme.placeholder}
            value={address}
            onChangeText={setAddress}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total:</Text>
            <Text style={styles.totalValue}>
              S/ {safeTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}>
            <Text style={styles.checkoutText}>
              Realizar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5',
    padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold',
    color: '#1A5276', marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 60,
    fontSize: 16, color: '#999' },
  footer: { borderTopWidth: 1,
    borderTopColor: '#E0E0E0', paddingTop: 16 },
  addressInput: { backgroundColor: '#FFF',
    borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#DDD',
    marginBottom: 12 },
  totalRow: { flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12 },
  totalLabel: { fontSize: 18, fontWeight: '600',
    color: '#333' },
  totalValue: { fontSize: 20, fontWeight: 'bold',
    color: '#148F77' },
  checkoutBtn: { backgroundColor: '#148F77',
    borderRadius: 10, padding: 16,
    alignItems: 'center' },
  checkoutText: { color: '#FFF', fontSize: 16,
    fontWeight: 'bold' },
});
