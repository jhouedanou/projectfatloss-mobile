import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function WorkoutCustomizerScreen() {
  const { user, db } = useContext(FirebaseContext);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const fetchPlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'workoutPlan'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlan(data);
    } catch (e) {
      setError("Erreur de chargement du plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlan(); }, [user]);

  const addDay = async () => {
    if (!user || !newTitle) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'workoutPlan'), {
        userId: user.uid,
        title: newTitle,
        description: '',
        order: plan.length,
      });
      setNewTitle('');
      fetchPlan();
    } catch (e) {
      setError("Erreur d'ajout du jour");
    }
  };

  const updateDay = async (id, title) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'workoutPlan', id), { title });
      fetchPlan();
    } catch (e) {
      setError("Erreur de modification du jour");
    }
  };

  if (!user) return <View style={styles.container}><Text>Connectez-vous pour personnaliser votre programme.</Text></View>;
  if (loading) return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personnalisation du programme</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Titre du nouveau jour"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <Button title="Ajouter" onPress={addDay} />
      </View>
      <FlatList
        data={plan}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.dayItem}>
            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={txt => updateDay(item.id, txt)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, marginBottom: 16, textAlign: 'center' },
  error: { color: 'red', textAlign: 'center' },
  inputRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginRight: 8, flex: 1 },
  dayItem: { backgroundColor: '#f5f5f5', marginBottom: 12, padding: 12, borderRadius: 8 },
});
