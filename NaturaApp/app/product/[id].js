import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ApiService from '../../src/services/apiService';
import Product from '../../src/models/Product';
import useCart from '../../src/viewmodels/useCart';
import { useTheme } from '../../src/services/ThemeContext';

export default function ProductDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error('ID de producto inválido');
      }

      const data = await ApiService.getProductById(id);
      setProduct(Product.fromJSON(data));
    } catch (err) {
      setError(err?.message || 'No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addItem(product);
      Alert.alert('Carrito', `${product.name} agregado al carrito`);
    } catch (err) {
      Alert.alert('Error', err?.message || 'No se pudo agregar al carrito');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size='large' color={theme.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.accent }]}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
        <Text style={[styles.category, { color: theme.secondaryText }]}>Categoria: {product.category}</Text>

        <View style={styles.row}>
          <Text style={[styles.price, { color: theme.accent }]}> {product.getFormattedPrice()} </Text>
          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: theme.accent }]}
            onPress={handleAddToCart}>
            <Text style={styles.cartButtonText}>Agregar al carrito</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoBlock, { backgroundColor: theme.surface }]}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Stock</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{product.stock}</Text>
          </View>
          <View style={[styles.infoBlock, { backgroundColor: theme.surface }]}>
            <Text style={[styles.infoLabel, { color: theme.secondaryText }]}>Calificación</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{product.rating?.toFixed(1) ?? '0.0'} ★</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Descripción</Text>
        <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>

        <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Beneficios</Text>
        {product.benefits && product.benefits.length > 0 ? (
          product.benefits.map((benefit, index) => (
            <Text key={`${benefit}-${index}`} style={[styles.benefitText, { color: theme.text }]}>• {benefit}</Text>
          ))
        ) : (
          <Text style={[styles.benefitText, { color: theme.text }]}>No hay beneficios registrados.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
  },
  cartButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cartButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  infoBlock: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
});