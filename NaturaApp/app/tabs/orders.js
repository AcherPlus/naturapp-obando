import React, { useEffect } from 'react';
import {
     View, Text, FlatList, StyleSheet,
     ActivityIndicator, RefreshControl,
} from 'react-native';
import useOrders from '../../src/viewmodels/useOrders';
import { useTheme } from '../../src/services/ThemeContext';

export default function OrdersScreen() {
  const { theme } = useTheme();
  const { orders, loading, error, refresh } = useOrders();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const containerStyle = [styles.container, { backgroundColor: theme.background }];
  const cardStyle = [styles.card, { backgroundColor: theme.surface, borderColor: theme.border }];
  const emptyStyle = [styles.empty, { color: theme.secondaryText }];
  const dateStyle = [styles.date, { color: theme.secondaryText }];
  const totalStyle = [styles.total, { color: theme.accent }];
  const itemsStyle = [styles.items, { color: theme.text }];
  const errorStyle = [styles.error, { color: '#E74C3C' }];

  const renderOrder = ({ item }) => (
    <View style={cardStyle}>
      <View style={styles.row}>
        <Text style={[styles.id, { color: theme.text }]}>Pedido #{item.id}</Text>
        <Text style={[styles.status, { color: item.getStatusColor() }]}> {item.status}</Text>
      </View>
      <Text style={dateStyle}>{item.getFormattedDate()}</Text>
      <Text style={totalStyle}>Total: S/ {item.total.toFixed(2)}</Text>
      <Text style={itemsStyle}>{item.items.length} items</Text>
    </View>
  );

  if (loading && orders.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.accent} />;
  }

  return (
    <View style={containerStyle}>
      {error && <Text style={errorStyle}>{error}</Text>}
      <FlatList
        data={orders}
        keyExtractor={o => o.id.toString()}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={<Text style={emptyStyle}>No hay pedidos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
     container: { flex: 1, padding: 12, backgroundColor: '#F5F5F5' },
     card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10 },
     row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
     id: { fontWeight: '700' },
     status: { fontWeight: '600' },
     date: { color: '#666', marginTop: 6 },
     total: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#148F77' },
     items: { marginTop: 4, color: '#333' },
     empty: { textAlign: 'center', marginTop: 40, color: '#999' },
     error: { color: '#E74C3C', textAlign: 'center', marginBottom: 8 },
});