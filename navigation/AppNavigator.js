import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen';
import StatsScreen from '../screens/StatsScreen';
import WeightTrackerScreen from '../screens/WeightTrackerScreen';
import WorkoutCustomizerScreen from '../screens/WorkoutCustomizerScreen';
import WorkoutCalendarScreen from '../screens/WorkoutCalendarScreen';
import SyncScreen from '../screens/SyncScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Historique" component={WorkoutHistoryScreen} />
      <Stack.Screen name="Statistiques" component={StatsScreen} />
      <Stack.Screen name="Poids" component={WeightTrackerScreen} />
      <Stack.Screen name="Personnalisation" component={WorkoutCustomizerScreen} />
      <Stack.Screen name="Calendrier" component={WorkoutCalendarScreen} />
      <Stack.Screen name="Synchronisation" component={SyncScreen} />
      <Stack.Screen name="Résumé" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
}
