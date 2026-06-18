import { useState, useCallback, useEffect } from 'react';
import ApiService from '../services/apiService';
import Order from '../models/Order';
import EventBus from '../services/EventBus';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getOrders();
      setOrders(data.map(o => Order.fromJSON(o)));
    } catch (err) {
      setError('No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Actualizar lista cuando se crea un nuevo pedido
    const unsub = EventBus.on('order:created', () => {
      loadOrders();
    });
    return () => unsub && unsub();
  }, [loadOrders]);

  return { orders, loading, error,
           refresh: loadOrders };
}
