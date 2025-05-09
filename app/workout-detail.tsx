import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function WorkoutDetailScreen() {
  const [expanded, setExpanded] = useState({});

  // Exemple de données pour les exercices de la séance
  const workout = {
    title: "Jour 1 - Haut du corps",
    exercises: [
      {
        name: "Pompes",
        sets: "4 × 12",
        icon: "arm-flex",
        instructions: "Placez vos mains légèrement plus larges que vos épaules. Descendez en fléchissant les coudes jusqu'à ce que votre poitrine soit à quelques centimètres du sol, puis remontez.",
        muscles: ["Pectoraux", "Triceps", "Épaules"],
        video: "pompes.mp4",
      },
      {
        name: "Développé épaules",
        sets: "3 × 15",
        icon: "weight-lifter",
        instructions: "Avec des haltères, commencez avec les bras fléchis au niveau des épaules, puis poussez vers le haut jusqu'à ce que vos bras soient tendus au-dessus de votre tête.",
        muscles: ["Épaules", "Triceps"],
        video: "developpe-epaules.mp4",
      },
      {
        name: "Tractions",
        sets: "4 × 8",
        icon: "human-handsup",
        instructions: "Saisissez la barre avec une prise plus large que vos épaules. Tirez votre corps vers le haut jusqu'à ce que votre menton dépasse la barre.",
        muscles: ["Dos", "Biceps"],
        video: "tractions.mp4",
      },
    ],
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const startWorkout = () => {
    router.navigate("/step-workout");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.workoutOverview}>
          <View style={styles.overviewItem}>
            <MaterialCommunityIcons name="dumbbell" size={24} color="#3b82f6" />
            <Text style={styles.overviewText}>{workout.exercises.length} Exercices</Text>
          </View>
          <View style={styles.overviewItem}>
            <MaterialCommunityIcons name="timer-outline" size={24} color="#3b82f6" />
            <Text style={styles.overviewText}>~30 min</Text>
          </View>
          <View style={styles.overviewItem}>
            <MaterialCommunityIcons name="fire" size={24} color="#3b82f6" />
            <Text style={styles.overviewText}>~200 cal</Text>
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercices</Text>

          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <TouchableOpacity
                style={styles.exerciseHeader}
                onPress={() => toggleExpand(index)}
              >
                <View style={styles.exerciseTitle}>
                  <MaterialCommunityIcons name={exercise.icon} size={28} color="#3b82f6" />
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSets}>{exercise.sets}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  name={expanded[index] ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#9ca3af"
                />
              </TouchableOpacity>

              {expanded[index] && (
                <View style={styles.exerciseDetails}>
                  <Text style={styles.detailTitle}>Instructions :</Text>
                  <Text style={styles.detailText}>{exercise.instructions}</Text>
                  
                  <Text style={styles.detailTitle}>Muscles travaillés :</Text>
                  <View style={styles.musclesList}>
                    {exercise.muscles.map((muscle, idx) => (
                      <View key={idx} style={styles.muscleTag}>
                        <Text style={styles.muscleTagText}>{muscle}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Text style={styles.startButtonText}>Commencer la séance</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b82f6",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 16,
  },
  workoutOverview: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  overviewItem: {
    alignItems: "center",
  },
  overviewText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  exercisesSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  exerciseCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 12,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseTitle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  exerciseDetails: {
    paddingTop: 12,
    paddingLeft: 40,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  musclesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  muscleTag: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  muscleTagText: {
    fontSize: 12,
    color: "#0369a1",
  },
  startButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
