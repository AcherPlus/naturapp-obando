import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import StorageService from './storageService';

const lightTheme = {
     background: '#F5F5F5',
     card: '#FFFFFF',
     text: '#222222',
     secondaryText: '#666666',
     border: '#E0E0E0',
     accent: '#148F77',
     input: '#FFFFFF',
     placeholder: '#999999',
     surface: '#FFFFFF',
};

const darkTheme = {
     background: '#111111',
     card: '#363535',
     text: '#EEEEEE',
     secondaryText: '#BBBBBB',
     border: '#333333',
     accent: '#1ABC9C',
     input: '#222222',
     placeholder: '#AAAAAA',
     surface: '#222222',
};

export const ThemeContext = createContext({
     dark: false,
     theme: lightTheme,
     toggle: () => {},
});

export function ThemeProvider({ children }) {
     const [dark, setDark] = useState(false);

     useEffect(() => {
          let mounted = true;
          StorageService.isDarkTheme().then(v => {
               if (mounted) setDark(!!v);
          }).catch(() => {});
          return () => { mounted = false; };
     }, []);

     const toggle = useCallback(() => {
          setDark(prev => {
               const newValue = !prev;
               StorageService.setDarkTheme(newValue).catch(console.error);
               return newValue;
          });
     }, []);

     const theme = dark ? darkTheme : lightTheme;

     return (
          <ThemeContext.Provider value={{ dark, theme, toggle }}>
               {children}
          </ThemeContext.Provider>
     );
}

export function useTheme() {
     return useContext(ThemeContext);
}

export default ThemeContext;
