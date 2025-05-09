import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function WorkoutHistoryScreen() {
  const { user, db } = useContext(FirebaseContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessions(data);
      } catch (e) {
        setError("Erreur de chargement de l'historique");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  if (!user) {
    return <View style={styles.container}><Text>Connectez-vous pour voir votre historique.</Text></View>;
  }
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des séances</Text>
      {sessions.length === 0 ? (
        <Text>Aucune séance enregistrée.</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.sessionItem}>
              <Text style={styles.sessionTitle}>{item.type || 'Séance'} - {item.date?.toDate ? item.date.toDate().toLocaleDateString() : item.date}</Text>
              <Text>Durée : {item.duration || 'N/A'} min</Text>
              <Text>Calories : {item.calories || 'N/A'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 16, textAlign: 'center' },
  error: { color: 'red', textAlign: 'center' },
  sessionItem: { backgroundColor: '#f5f5f5', marginBottom: 12, padding: 12, borderRadius: 8 },
  sessionTitle: { fontWeight: 'bold', marginBottom: 4 },
});
