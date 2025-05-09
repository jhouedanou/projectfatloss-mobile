import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  // Exemple de données pour les séances d'entraînement - à remplacer par les vraies données
  const exampleWorkout = {
    title: "Jour 1 - Haut du corps",
    exercises: [
      { name: "Pompes", sets: "4 x 12", icon: "arm-flex" },
      { name: "Développé épaules", sets: "3 x 15", icon: "weight-lifter" },
      { name: "Tractions", sets: "4 x 8", icon: "human-handsup" },
    ],
  };

  // État pour suivre le jour actuel (à charger depuis le stockage par la suite)
  const [currentDay, setCurrentDay] = useState(0);
  const [fatBurnerMode, setFatBurnerMode] = useState(false);

  // Fonction pour démarrer la séance
  const startWorkout = () => {
    router.navigate("/workout-detail");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Project Fat Loss</Text>
        <TouchableOpacity style={styles.modeToggle} onPress={() => setFatBurnerMode(!fatBurnerMode)}>
          <MaterialCommunityIcons name="fire" size={24} color={fatBurnerMode ? "#f97316" : "#9ca3af"} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Séance du jour</Text>
        <Text style={styles.workoutTitle}>{exampleWorkout.title}</Text>
        
        <View style={styles.exerciseList}>
          {exampleWorkout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <MaterialCommunityIcons name={exercise.icon} size={24} color="#3b82f6" />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseSets}>{exercise.sets}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Text style={styles.startButtonText}>Commencer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsPreview}>
        <Text style={styles.sectionTitle}>Résumé</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4500</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>320 kg</Text>
            <Text style={styles.statLabel}>Soulevé</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3b82f6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modeToggle: {
    padding: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  exerciseInfo: {
    marginLeft: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
  },
  exerciseSets: {
    fontSize: 14,
    color: "#6b7280",
  },
  startButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsPreview: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});
