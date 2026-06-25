// src/services/firebaseConfig.js
// ============================================
// CONFIGURACIÓN DE FIREBASE
// Sesión 11: Integración de Firebase
// Auth + Firestore + Storage
// ============================================
//
// INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Ir a https://console.firebase.google.com/
// 2. Crear un nuevo proyecto o seleccionar uno existente
// 3. Agregar una app web (icono </>)
// 4. Copiar la configuración de Firebase y reemplazar los valores abajo
// 5. Habilitar Authentication > Email/Password en la consola
// 6. Crear una base de datos Firestore
// 7. Habilitar Storage
// ============================================

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Configuración de Firebase ──
// REEMPLAZAR con tus credenciales de Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyA2M04juSWDkKY3dR4JZiKeB3HDM-Gim30',
  authDomain: 'naturaapp-firebase-sem12.firebaseapp.com',
  projectId: 'naturaapp-firebase-sem12',
  storageBucket: 'naturaapp-firebase-sem12.firebasestorage.app',
  messagingSenderId: '345389114651',
  appId: '1:345389114651:web:7d5ed41d2c9e60e4065fbe',
  measurementId: 'G-29TXFMZ404',
};

// ── Inicializar Firebase ──
const app = initializeApp(firebaseConfig);

// ── Auth con persistencia en AsyncStorage ──
// Esto mantiene la sesión del usuario entre cierres de la app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ── Firestore (Base de datos) ──
const db = getFirestore(app);

// ── Storage (Almacenamiento de archivos) ──
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;
