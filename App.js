import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { FirebaseProvider } from './services/FirebaseContext';

export default function App() {
  return (
    <FirebaseProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </FirebaseProvider>
  );
}
