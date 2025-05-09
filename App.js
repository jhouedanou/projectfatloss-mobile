import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { FirebaseProvider } from './services/FirebaseContext';
import { ThemeProvider } from './src/theme/ThemeProvider';
import theme from './src/theme/theme';

// Create a custom navigation theme based on our dark theme
const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.error,
  },
};

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <FirebaseProvider>
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </FirebaseProvider>
    </ThemeProvider>
  );
}
