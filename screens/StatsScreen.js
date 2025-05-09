import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

  if (!user) {
    return <View style={styles.container}><Text>Connectez-vous pour voir vos statistiques.</Text></View>;
  }
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <Text style={styles.stat}>Nombre de séances : {stats.totalSessions}</Text>
      <Text style={styles.stat}>Durée totale : {stats.totalDuration} min</Text>
      <Text style={styles.stat}>Calories totales : {stats.totalCalories}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  stat: { fontSize: 18, marginBottom: 10 },
  error: { color: 'red', textAlign: 'center' },
});
