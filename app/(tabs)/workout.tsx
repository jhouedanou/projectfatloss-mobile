import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// Exemple de données pour les séances d'entraînement - à remplacer par les vraies données
const workoutDays = [
  {
    title: "Jour 1 - Haut du corps",
    exercises: [
      { name: "Pompes", sets: "4 x 12", icon: "arm-flex" },
      { name: "Développé épaules", sets: "3 x 15", icon: "weight-lifter" },
      { name: "Tractions", sets: "4 x 8", icon: "human-handsup" },
    ],
  },
  {
    title: "Jour 2 - Bas du corps",
    exercises: [
      { name: "Squats", sets: "4 x 15", icon: "human-handsdown" },
      { name: "Fentes", sets: "3 x 12 (chaque jambe)", icon: "run" },
      { name: "Extensions", sets: "3 x 15", icon: "human-male" },
    ],
  },
  {
    title: "Jour 3 - Full Body",
    exercises: [
      { name: "Burpees", sets: "4 x 10", icon: "human-handsup" },
      { name: "Mountain Climbers", sets: "3 x 20", icon: "run-fast" },
      { name: "Jumping Jacks", sets: "3 x 30", icon: "human-greeting" },
    ],
  },
];

export default function WorkoutScreen() {
  const [selectedDay, setSelectedDay] = useState(0);

  const startWorkout = () => {
    // Navigation vers la séance d'entraînement étape par étape (à implémenter)
    router.navigate("/step-workout");
  };

  const renderDayTab = (day, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.dayTab, index === selectedDay && styles.dayTabActive]}
      onPress={() => setSelectedDay(index)}
    >
      <Text style={[styles.dayTabText, index === selectedDay && styles.dayTabTextActive]}>
        Jour {index + 1}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Programme d'entraînement</Text>
      </View>

      <ScrollView horizontal style={styles.dayTabs} showsHorizontalScrollIndicator={false}>
        {workoutDays.map((day, index) => renderDayTab(day, index))}
      </ScrollView>

      <ScrollView style={styles.content}>
        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>{workoutDays[selectedDay].title}</Text>

          {workoutDays[selectedDay].exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <MaterialCommunityIcons name={exercise.icon} size={24} color="#3b82f6" />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseSets}>{exercise.sets}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Commencer la séance</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.customizeSection}>
          <Text style={styles.sectionTitle}>Personnalisation</Text>
          <Text style={styles.sectionDescription}>
            Personnalisez votre programme d'entraînement en fonction de vos objectifs et de votre
            niveau.
          </Text>
          <TouchableOpacity style={styles.customizeButton}>
            <Text style={styles.customizeButtonText}>Personnaliser</Text>
            <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dayTabs: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  dayTabActive: {
    backgroundColor: "#3b82f6",
  },
  dayTabText: {
    fontWeight: "500",
    color: "#6b7280",
  },
  dayTabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
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
    marginTop: 16,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customizeSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  customizeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 8,
    padding: 12,
  },
  customizeButtonText: {
    color: "#3b82f6",
    fontWeight: "500",
    marginRight: 8,
  },
});
