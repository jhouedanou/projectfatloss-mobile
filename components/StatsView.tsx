import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getWorkoutStats, WorkoutStats } from '../services/storage';

export default function StatsView() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkoutStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await getWorkoutStats();
      setStats(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.totalSessions || 0}</Text>
          <Text style={styles.statLabel}>Séances</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats?.totalCalories || 0}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round((stats?.totalWeightLifted || 0))}</Text>
          <Text style={styles.statLabel}>kg Soulevés</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... styles existants ...
});
