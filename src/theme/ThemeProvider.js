import React, { createContext, useContext } from 'react';
import theme from './theme';

// Create a context for the theme
const ThemeContext = createContext(theme);

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
