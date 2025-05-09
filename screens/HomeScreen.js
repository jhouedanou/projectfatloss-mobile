import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Exemple de données d'entraînement (à remplacer par la logique réelle ou la synchronisation Firebase)
const initialWorkoutPlan = [
  { day: 1, title: 'Jour 1', description: 'Séance cardio' },
  { day: 2, title: 'Jour 2', description: 'Renforcement musculaire' },
  { day: 3, title: 'Jour 3', description: 'Repos ou stretching' },
  { day: 4, title: 'Jour 4', description: 'HIIT' },
  { day: 5, title: 'Jour 5', description: 'Cardio léger' },
  { day: 6, title: 'Jour 6', description: 'Plyométrie' },
  { day: 7, title: 'Jour 7', description: 'Repos complet' },
];

export default function HomeScreen({ navigation }) {
  const { logout, user } = useContext(FirebaseContext);
  const [current, setCurrent] = useState(0);
  const [workoutPlan, setWorkoutPlan] = useState(initialWorkoutPlan);

  useEffect(() => {
    // Charger le jour courant depuis le stockage local
    AsyncStorage.getItem('currentWorkoutDay').then(savedDay => {
      if (savedDay !== null) setCurrent(parseInt(savedDay, 10));
    });
  }, []);

  useEffect(() => {
    // Sauvegarder le jour courant à chaque changement
    AsyncStorage.setItem('currentWorkoutDay', current.toString());
  }, [current]);

  const moveToNextDay = () => {
    setCurrent(prev => (prev + 1) % workoutPlan.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user?.email}</Text>
      <ScrollView horizontal style={styles.tabs}>
        {workoutPlan.map((d, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, i === current && styles.activeTab]}
            onPress={() => setCurrent(i)}
          >
            <Text style={styles.tabText}>Jour {i + 1}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.workoutBox}>
        <Text style={styles.workoutTitle}>{workoutPlan[current].title}</Text>
        <Text>{workoutPlan[current].description}</Text>
      </View>
      <Button title="Séance suivante" onPress={moveToNextDay} />
      <View style={styles.navButtons}>
        <Button title="Historique" onPress={() => navigation.navigate('Historique')} />
        <Button title="Statistiques" onPress={() => navigation.navigate('Statistiques')} />
        <Button title="Poids" onPress={() => navigation.navigate('Poids')} />
        <Button title="Personnalisation" onPress={() => navigation.navigate('Personnalisation')} />
        <Button title="Calendrier" onPress={() => navigation.navigate('Calendrier')} />
        <Button title="Synchronisation" onPress={() => navigation.navigate('Synchronisation')} />
      </View>
      <Button title="Déconnexion" onPress={() => logout(navigation)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  tabs: { flexGrow: 0, marginBottom: 16 },
  tab: { padding: 10, backgroundColor: '#eee', marginHorizontal: 4, borderRadius: 6 },
  activeTab: { backgroundColor: '#2196F3' },
  tabText: { color: '#222' },
  workoutBox: { backgroundColor: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center', width: 300 },
  workoutTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  navButtons: { width: '100%', marginVertical: 16 },
});
