import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../services/ThemeContext';

export default function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}> 
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.detail, { color: theme.secondaryText }]}>S/ {item.price}</Text>
        <Text style={[styles.detail, { color: theme.secondaryText }]}>Cantidad: {item.quantity}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onDecrease}>
          <Text style={[styles.button, { color: theme.text }]}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onIncrease}>
          <Text style={[styles.button, { color: theme.text }]}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onRemove}>
          <Text style={[styles.remove, { color: '#E74C3C' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  info: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detail: {
    marginTop: 4,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  remove: {
    color: 'red',
  },
});