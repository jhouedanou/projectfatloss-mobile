import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import theme from '../src/theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
  const { user, db } = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    totalCalories: 0,
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchStats = async () => {
      try {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        let totalSessions = 0, totalDuration = 0, totalCalories = 0;
        querySnapshot.forEach(doc => {
          totalSessions++;
          const d = doc.data();
          totalDuration += Number(d.duration) || 0;
          totalCalories += Number(d.calories) || 0;
        });
        setStats({ totalSessions, totalDuration, totalCalories });
      } catch (e) {
        setError("Erreur de chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const renderStatCard = (icon, title, value, unit) => (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={28} color={theme.colors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <View style={styles.statValueContainer}>
          <Text style={styles.statValue}>{value}</Text>
          {unit && <Text style={styles.statUnit}>{unit}</Text>}
        </View>
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Ionicons name="lock-closed" size={60} color={theme.colors.textSecondary} />
          <Text style={styles.noUserText}>Connectez-vous pour voir vos statistiques.</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des statistiques...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Ionicons name="alert-circle" size={60} color={theme.colors.error} />
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistiques</Text>
          <Text style={styles.subtitle}>Votre progression en chiffres</Text>
        </View>
        
        <View style={styles.statsContainer}>
          {renderStatCard('fitness', 'Séances', stats.totalSessions, null)}
          {renderStatCard('time', 'Durée totale', stats.totalDuration, 'min')}
          {renderStatCard('flame', 'Calories brûlées', stats.totalCalories, 'kcal')}
        </View>
        
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.info} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Continuez à vous entraîner régulièrement pour améliorer vos statistiques et atteindre vos objectifs de remise en forme.
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: theme.spacing.l,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing.l,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: { 
    fontSize: theme.typography.fontSizes.xxlarge, 
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  statContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: theme.typography.fontSizes.xlarge,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text,
  },
  statUnit: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  infoIcon: {
    marginRight: theme.spacing.m,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.text,
    lineHeight: 22,
  },
  noUserText: {
    fontSize: theme.typography.fontSizes.large,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.m,
  },
  error: { 
    color: theme.colors.error, 
    textAlign: 'center',
    fontSize: theme.typography.fontSizes.medium,
    marginTop: theme.spacing.m,
  },
});
