import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getWorkoutStats } from "../../services/storage";
import { workoutProgram } from "../../services/workoutData";

export default function HomeScreen() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(0);
  const [fatBurnerMode, setFatBurnerMode] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCalories: 0,
    totalWeightLifted: 0
  });

  // Charger le programme d'entraînement
  useEffect(() => {
    setDays(workoutProgram);
    setLoading(false);
  }, []);

  // Déterminer automatiquement le jour actuel (pour synchroniser avec l'écran des séances)
  useEffect(() => {
    // En pratique, cela pourrait être basé sur la date actuelle ou les préférences de l'utilisateur
    const today = new Date().getDay(); // 0 = dimanche, 1 = lundi, etc.
    // Map le jour de la semaine à un index dans notre programme (0-6)
    // Supposons que nous commençons le lundi (jour 1) et que nous avons 7 jours par semaine
    const dayIndex = today === 0 ? 6 : today - 1; // Convertit dimanche=0 en index 6, lundi=1 en index 0, etc.
    if (dayIndex < days.length) {
      setCurrentDay(dayIndex);
    }
  }, [days]);

  // Obtenir les données de la séance du jour actuel
  const todayWorkout = days[currentDay];

  // Fonction pour démarrer la séance
  const startWorkout = () => {
    router.navigate({
      pathname: "/step-workout",
      params: { dayIndex: currentDay.toString() }
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const workoutStats = await getWorkoutStats();
      setStats(workoutStats);
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    }
  };

  if (loading || !days || days.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement du programme...</Text>
      </View>
    );
  }

  // Sécuriser l'accès à todayWorkout
  const safeDay = Math.max(0, Math.min(currentDay, days.length - 1));
  const workoutForTheDay = days[safeDay];

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
        <Text style={styles.workoutTitle}>{workoutForTheDay.title}</Text>
        
        <View style={styles.exerciseList}>
          {workoutForTheDay.exercises.slice(0, 3).map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <MaterialCommunityIcons name={exercise.icon as any} size={24} color="#3b82f6" />
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
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCalories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(stats.totalWeightLifted)} kg</Text>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
});
