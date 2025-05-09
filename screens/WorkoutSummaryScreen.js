import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { exportWorkoutToGoogleFit } from '../services/GoogleFitService';

export default function WorkoutSummaryScreen({ route }) {
  const { duration, calories, startDate, endDate } = route.params || {};

  const handleExport = async () => {
    try {
      await exportWorkoutToGoogleFit({
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date().toISOString(),
        calories: calories || 0,
        steps: 0,
        distance: 0,
        activityName: 'Workout',
      });
      Alert.alert('Succès', 'Séance exportée vers Google Fit !');
    } catch (e) {
      Alert.alert('Erreur', "L'export Google Fit a échoué : " + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Résumé de la séance</Text>
      <Text>Durée : {duration ? `${duration} min` : 'N/A'}</Text>
      <Text>Calories : {calories ? calories : 'N/A'}</Text>
      <Button title="Exporter vers Google Fit" onPress={handleExport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
});
