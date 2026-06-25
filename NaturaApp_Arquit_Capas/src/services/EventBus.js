// Simple event bus for cross-component communication
const listeners = {};

export default {
  on(event, cb) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(cb);
    return () => this.off(event, cb);
  },
  off(event, cb) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(l => l !== cb);
  },
  emit(event, payload) {
    (listeners[event] || []).forEach(cb => {
      try { cb(payload); } catch (e) { console.error('EventBus handler error', e); }
    });
  }
};
