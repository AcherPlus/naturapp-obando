// src/hooks/useOrders.js
// ============================================
// Hook de Pedidos — Firestore Service
// Sesión 11: Gestión de órdenes con Firebase
// ============================================

import { useState, useCallback } from 'react';
import { OrderService } from '../services/firestoreService';

export function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar pedidos del usuario
  const loadOrders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getByUser(userId);
      // Log para depuración: qué orders devuelve el servicio
      console.log('useOrders.loadOrders — userId:', userId, 'orders.count:', Array.isArray(data) ? data.length : 0, 'orders:', data);
      setOrders(data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Crear nuevo pedido
  // const createOrder = useCallback(async (orderData) => {
  //   if (!userId) return null;
    
  //   const tempOrder = {
  //     ...orderData,
  //     id: 'temp-' + Date.now(),
  //     userId,
  //     status: 'pending',
  //     createdAt: new Date().toISOString(),
  //   };
    
  //   setOrders((prev) => [tempOrder, ...prev]);
  //   setError(null);

  //   try {
  //     const savedOrder = await OrderService.create(userId, orderData);

  //     setOrders((prev) => prev.map(o => o.id === tempOrder.id ? savedOrder : o));

  //     return savedOrder;
  //   } catch (err) {
  //     console.error('Error al crear pedido', err);
  //     setOrders((prev) => prev.filter(o => o.id !== tempOrder.id));
  //     setError('No se pudo crear el pedido');
  //     return null;
  //   }

  // }, [userId, loadOrders]);

  const createOrder = useCallback(async (orderData) => {
    if (!userId) {
      console.warn('createOrder abortado: userId no definido');
      return null;
    }
    
    const tempOrder = {
      ...orderData,
      id: 'temp-' + Date.now(),
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    console.log('createOrder: Iniciando actualización optimista', tempOrder);
    setOrders((prev) => [tempOrder, ...prev]);
    setError(null);

    try {
      console.log('createOrder: Llamando a OrderService.create...');
      const savedOrder = await OrderService.create(userId, orderData);
      
      if (!savedOrder || !savedOrder.id) {
        console.error('createOrder: El servicio devolvió un pedido inválido', savedOrder);
        throw new Error('Respuesta inválida del servidor');
      }

      console.log('createOrder: Pedido guardado exitosamente en Firestore', savedOrder);
      setOrders((prev) => prev.map(o => o.id === tempOrder.id ? savedOrder : o));

      return savedOrder;
    } catch (err) {
      console.error('createOrder: ERROR en la capa de persistencia', err);
      setOrders((prev) => prev.filter(o => o.id !== tempOrder.id));
      setError('No se pudo crear el pedido');
      return null;
    }
  }, [userId]);

  // Cancelar pedido
  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    try {
      await OrderService.cancel(orderId);
      await loadOrders();
    } catch (err) {
      console.error('Error cancelando pedido:', err);
      setError('No se pudo cancelar el pedido');
    } finally {
      setLoading(false);
    }
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    cancelOrder,
  };
}
