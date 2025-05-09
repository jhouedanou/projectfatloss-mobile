import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export default function WeightTrackerScreen() {
  const { user, db } = useContext(FirebaseContext);
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newWeight, setNewWeight] = useState('');

  const fetchWeights = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'weights'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWeights(data);
    } catch (e) {
      setError("Erreur de chargement du poids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeights(); }, [user]);

  const addWeight = async () => {
    if (!user || !newWeight) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'weights'), {
        userId: user.uid,
        value: parseFloat(newWeight),
        date: new Date()
      });
      setNewWeight('');
      fetchWeights();
    } catch (e) {
      setError("Erreur d'ajout du poids");
    }
  };

  const removeWeight = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'weights', id));
      fetchWeights();
    } catch (e) {
      setError("Erreur de suppression du poids");
    }
  };

  if (!user) {
    return <View style={styles.container}><Text>Connectez-vous pour suivre votre poids.</Text></View>;
  }
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi du poids</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Poids (kg)"
          value={newWeight}
          onChangeText={setNewWeight}
        />
        <Button title="Ajouter" onPress={addWeight} />
      </View>
      <FlatList
        data={weights}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.weightItem}>
            <Text>{item.value} kg - {item.date?.toDate ? item.date.toDate().toLocaleDateString() : item.date}</Text>
            <TouchableOpacity onPress={() => removeWeight(item.id)}><Text style={styles.delete}>Supprimer</Text></TouchableOpacity>
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
  weightItem: { backgroundColor: '#f5f5f5', marginBottom: 12, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  delete: { color: 'red', marginLeft: 16 },
});
