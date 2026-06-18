// Modelo que representa un pedido completado
export default class Order {
  constructor({ id, items, total, status, date,
                address }) {
    this.id = id;
    this.items = items || [];     // Lista de CartItems
    this.total = total;           // Monto total
    this.status = status || 'Pendiente'; // Estado del pedido
    this.date = date || new Date().toISOString();
    this.address = address || '';
  }

  static fromJSON(json) {
    return new Order(json);
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString('es-PE');
  }

  getStatusColor() {
    const colors = {
      Pendiente: '#F39C12',
      Procesando: '#3498DB',
      Enviado: '#8E44AD',
      Entregado: '#27AE60',
    };
    return colors[this.status] || '#95A5A6';
  }
}
