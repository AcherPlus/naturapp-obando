import { Stack } from 'expo-router';
import { useEffect } from 'react';
import DatabaseService from '../src/services/databaseService';
import { ThemeProvider } from '../src/services/ThemeContext';

export default function AppLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#1A5276' },
        headerTintColor: '#FFF',
      }}>
      <Stack.Screen name='tabs'
        options={{ headerShown: false }} />
      <Stack.Screen name='product/[id]'
        options={{ title: 'Detalle del Producto' }} />
      </Stack>
    </ThemeProvider>
  );
}
