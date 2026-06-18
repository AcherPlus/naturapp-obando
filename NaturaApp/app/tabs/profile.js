import React from 'react';
import {
     View, Text, TextInput, StyleSheet,
     Switch, TouchableOpacity, Alert,
} from 'react-native';
import useProfile from '../../src/viewmodels/useProfile';
import { useTheme } from '../../src/services/ThemeContext';

export default function ProfileScreen() {
     const {
          name,
          setName,
          email,
          setEmail,
          notifications,
          saveProfile,
          toggleNotifications,
     } = useProfile();
     const { theme, dark, toggle } = useTheme();

     const handleSave = async () => {
          await saveProfile();
          Alert.alert('Perfil', 'Perfil guardado');
     };

     const containerStyle = [styles.container, { backgroundColor: theme.background }];
     const labelStyle = [styles.label, { color: theme.text }];
     const inputStyle = [styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }];
     const switchLabelStyle = [styles.label, { color: theme.text }];
     const saveBtnStyle = [styles.saveBtn, { backgroundColor: theme.accent }];
     const saveTextStyle = [styles.saveText, { color: '#FFF' }];

     return (
          <View style={containerStyle}>
               <Text style={switchLabelStyle}>Nombre</Text>
               <TextInput
                    style={inputStyle}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor={theme.placeholder}
               />

               <Text style={switchLabelStyle}>Correo</Text>
               <TextInput
                    style={inputStyle}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor={theme.placeholder}
               />

               <View style={styles.row}>
                    <Text style={switchLabelStyle}>Tema oscuro</Text>
                    <Switch
                    value={dark}
                    onValueChange={(value) => {
                         console.log('Tema oscuro:', value);
                         toggle();
                    }}
                    />
               </View>

               <View style={styles.row}>
                    <Text style={switchLabelStyle}>Notificaciones</Text>
                    <Switch value={notifications} onValueChange={toggleNotifications} />
               </View>

               <TouchableOpacity style={saveBtnStyle} onPress={handleSave}>
                    <Text style={saveTextStyle}>Guardar</Text>
               </TouchableOpacity>
          </View>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
     label: { fontSize: 14, color: '#333', marginBottom: 6 },
     input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
     row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
     saveBtn: { backgroundColor: '#148F77', padding: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
     saveText: { color: '#FFF', fontWeight: '700' },
});