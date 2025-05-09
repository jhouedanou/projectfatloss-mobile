import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ExerciseVideoModal from "../../components/ExerciseVideoModal";
import { getWorkoutPlan } from "../../services/storage";

export default function WorkoutScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedExerciseName, setSelectedExerciseName] = useState("");
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState([]);

  // Déterminer automatiquement le jour actuel (pour simuler une séance du jour)
  useEffect(() => {
    // En pratique, cela pourrait être basé sur la date actuelle ou les préférences de l'utilisateur
    const today = new Date().getDay(); // 0 = dimanche, 1 = lundi, etc.
    // Map le jour de la semaine à un index dans notre programme (0-6)
    // Supposons que nous commençons le lundi (jour 1) et que nous avons 7 jours par semaine
    const dayIndex = today === 0 ? 6 : today - 1; // Convertit dimanche=0 en index 6, lundi=1 en index 0, etc.
    if (dayIndex < days.length) {
      setSelectedDay(dayIndex);
    }
  }, [days]);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      setLoading(true);
      const plan = await getWorkoutPlan();
      setDays(plan || []);
    } catch (error) {
      console.error("Erreur lors du chargement du plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    // Navigation vers la séance d'entraînement étape par étape avec le jour sélectionné
    router.navigate({
      pathname: "/step-workout",
      params: { dayIndex: selectedDay.toString() }
    });
  };

  const handleOpenVideo = (videoId: string, exerciseName: string) => {
    setSelectedVideoId(videoId);
    setSelectedExerciseName(exerciseName);
    setVideoModalVisible(true);
  };

  // Rendre la liste des jours plus compacte avec des boutons numérotés
  const renderDayTab = (day: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.dayTab, index === selectedDay && styles.dayTabActive]}
      onPress={() => setSelectedDay(index)}
    >
      <Text style={[styles.dayTabText, index === selectedDay && styles.dayTabTextActive]}>
        {index + 1}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement du programme...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Séances</Text>
      </View>

      <View style={styles.programHeader}>
        <Text style={styles.programTitle}>Programme d'entraînement</Text>
      </View>

      <View style={styles.dayTabsContainer}>
        {days && days.length > 0 ? (
          days.map((day, index) => renderDayTab(day, index))
        ) : (
          <Text style={styles.noDataText}>Aucun programme disponible</Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>{days[selectedDay]?.title}</Text>

          {days[selectedDay]?.exercises.map((exercise: Exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <MaterialCommunityIcons 
                name={exercise.icon as any} 
                size={24} 
                color="#3b82f6" 
              />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseSets}>{exercise.sets} - {exercise.equip}</Text>
              </View>
              {exercise.videoId && (
                <TouchableOpacity
                  style={styles.videoButton}
                  onPress={() => handleOpenVideo(exercise.videoId || "", exercise.name)}
                >
                  <MaterialCommunityIcons name="youtube" size={24} color="#f87171" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Commencer la séance</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.customizeSection}>
          <Text style={styles.sectionTitle}>Personnalisation</Text>
          <Text style={styles.sectionDescription}>
            Personnalisez votre programme d&apos;entraînement en fonction de vos objectifs et de votre
            niveau.
          </Text>
          <TouchableOpacity style={styles.customizeButton}>
            <Text style={styles.customizeButtonText}>Personnaliser</Text>
            <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ExerciseVideoModal
        isVisible={videoModalVisible}
        videoId={selectedVideoId}
        exerciseName={selectedExerciseName}
        onClose={() => setVideoModalVisible(false)}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

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
  programHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  programTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  dayTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  dayTab: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
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
  videoButton: {
    padding: 8,
    borderRadius: 20,
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: "#6b7280",
    padding: 20,
  }
});
