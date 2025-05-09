import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { FirebaseContext } from '../services/FirebaseContext';

export default function SyncScreen() {
  const { user } = useContext(FirebaseContext);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState('');

  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    setStatus('Synchronisation en cours...');
    // Ici, tu peux ajouter la logique de synchronisation manuelle (upload/download)
    setTimeout(() => {
      setSyncing(false);
      setStatus('Synchronisation terminée !');
    }, 2000);
  };

  if (!user) return <View style={styles.container}><Text>Connectez-vous pour synchroniser vos données.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Synchronisation</Text>
      <Button title="Synchroniser maintenant" onPress={handleSync} disabled={syncing} />
      {syncing && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 22, marginBottom: 16 },
  status: { marginTop: 16, color: 'green' },
});
