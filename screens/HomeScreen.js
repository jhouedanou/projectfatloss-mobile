import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../src/theme/theme';
import { Ionicons } from '@expo/vector-icons';

// Exemple de données d'entraînement (à remplacer par la logique réelle ou la synchronisation Firebase)
const initialWorkoutPlan = [
  { day: 1, title: 'Jour 1', description: 'Séance cardio', icon: 'heart' },
  { day: 2, title: 'Jour 2', description: 'Renforcement musculaire', icon: 'barbell' },
  { day: 3, title: 'Jour 3', description: 'Repos ou stretching', icon: 'body' },
  { day: 4, title: 'Jour 4', description: 'HIIT', icon: 'flash' },
  { day: 5, title: 'Jour 5', description: 'Cardio léger', icon: 'walk' },
  { day: 6, title: 'Jour 6', description: 'Plyométrie', icon: 'fitness' },
  { day: 7, title: 'Jour 7', description: 'Repos complet', icon: 'bed' },
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

  const renderNavButton = (title, screenName, icon) => (
    <TouchableOpacity
      style={styles.navButton}
      onPress={() => navigation.navigate(screenName)}
    >
      <Ionicons name={icon} size={24} color={theme.colors.primary} />
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {workoutPlan.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tab, i === current && styles.activeTab]}
              onPress={() => setCurrent(i)}
            >
              <Text style={[styles.tabText, i === current && styles.activeTabText]}>Jour {i + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.workoutBox}>
          <View style={styles.workoutIconContainer}>
            <Ionicons 
              name={workoutPlan[current].icon} 
              size={40} 
              color={theme.colors.primary} 
            />
          </View>
          <Text style={styles.workoutTitle}>{workoutPlan[current].title}</Text>
          <Text style={styles.workoutDescription}>{workoutPlan[current].description}</Text>
          
          <TouchableOpacity style={styles.nextButton} onPress={moveToNextDay}>
            <Text style={styles.nextButtonText}>Séance suivante</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Navigation</Text>
        
        <View style={styles.navButtonsGrid}>
          {renderNavButton('Historique', 'Historique', 'time')}
          {renderNavButton('Statistiques', 'Statistiques', 'stats-chart')}
          {renderNavButton('Poids', 'Poids', 'scale')}
          {renderNavButton('Personnalisation', 'Personnalisation', 'options')}
          {renderNavButton('Calendrier', 'Calendrier', 'calendar')}
          {renderNavButton('Synchronisation', 'Synchronisation', 'sync')}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => logout(navigation)}
        >
          <Ionicons name="log-out" size={20} color={theme.colors.error} />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: { 
    flex: 1, 
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.l,
  },
  title: { 
    fontSize: theme.typography.fontSizes.xlarge, 
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.large,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text,
    marginVertical: theme.spacing.m,
  },
  tabs: { 
    flexGrow: 0, 
    marginBottom: theme.spacing.m,
  },
  tab: { 
    padding: theme.spacing.m, 
    backgroundColor: theme.colors.tabInactive, 
    marginRight: theme.spacing.s, 
    borderRadius: theme.borderRadius.medium,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTab: { 
    backgroundColor: theme.colors.tabActive,
    ...theme.shadows.small,
  },
  tabText: { 
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  activeTabText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
  },
  workoutBox: { 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.l, 
    borderRadius: theme.borderRadius.large, 
    marginBottom: theme.spacing.l, 
    alignItems: 'center', 
    width: '100%',
    ...theme.shadows.medium,
  },
  workoutIconContainer: {
    backgroundColor: theme.colors.background,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  workoutTitle: { 
    fontSize: theme.typography.fontSizes.large, 
    fontWeight: theme.typography.fontWeights.bold, 
    marginBottom: theme.spacing.s,
    color: theme.colors.text,
  },
  workoutDescription: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  nextButtonText: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeights.bold,
    marginRight: theme.spacing.s,
  },
  navButtonsGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.l,
  },
  navButton: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  navButtonText: {
    color: theme.colors.text,
    marginTop: theme.spacing.s,
    fontWeight: theme.typography.fontWeights.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.m,
  },
  logoutButtonText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.s,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
