import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

// Composant pour afficher le timer
function Timer({ duration, running, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!running) return;
    
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    // Vibrer aux moments clés
    if (timeLeft === 5 || timeLeft === 3 || timeLeft === 1) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    const timer = setTimeout(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, running, onComplete]);

  // Formater le temps restant
  const formatTime = (seconds) => {
    return `${seconds}`;
  };

  return (
    <View style={styles.timer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}s</Text>
    </View>
  );
}

// Composant pour la pause entre les séries ou exercices
function PauseScreen({ duration, onComplete, onSkip, isExerciseTransition }) {
  return (
    <View style={styles.pauseContainer}>
      <Text style={styles.pauseTitle}>Pause</Text>
      <Timer duration={duration} running={true} onComplete={onComplete} />
      <Text style={styles.pauseSubtitle}>
        Prépare-toi pour {isExerciseTransition ? "le prochain exercice" : "la prochaine série"}
      </Text>
      {!isExerciseTransition && (
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Passer la pause</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Écran principal pour la séance étape par étape
export default function StepWorkout() {
  // État pour suivre la progression
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [inPause, setInPause] = useState(false);
  const [isExerciseTransition, setIsExerciseTransition] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieAnimation, setCalorieAnimation] = useState(false);
  
  // Options
  const [fatBurnerMode, setFatBurnerMode] = useState(false);
  
  // Définir la durée de pause selon le mode
  const pauseDuration = fatBurnerMode ? 10 : 30;
  
  // Exemple de données d'entraînement (à remplacer par des données réelles dans le futur)
  const workout = {
    title: "Jour 1 - Haut du corps",
    exercises: [
      { 
        name: "Pompes", 
        sets: "3 × 12", 
        icon: "arm-flex", 
        calories: 8,
        timer: false
      },
      { 
        name: "Développé épaules", 
        sets: "3 × 15", 
        icon: "weight-lifter", 
        calories: 10,
        timer: false
      },
      { 
        name: "Planche", 
        sets: "3 × 30s", 
        icon: "human-handsdown", 
        calories: 7,
        timer: true,
        duration: 30
      }
    ]
  };
  
  // Extraire le nombre de séries pour l'exercice actuel
  const getSetCount = (sets) => {
    const match = sets.match(/(\d+)\s*[x×]/i);
    return match ? parseInt(match[1]) : 1;
  };
  
  const currentExercise = workout.exercises[currentExerciseIndex] || {};
  const totalSets = getSetCount(currentExercise.sets || "1 x 1");
  const isLastSet = currentSetIndex === totalSets - 1;
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  
  // Gérer l'achèvement d'une série
  const handleSetComplete = () => {
    // Ajouter des calories
    const caloriesEarned = currentExercise.calories || 5;
    setTotalCalories(prev => prev + caloriesEarned);
    
    // Déclencher l'animation des calories
    setCalorieAnimation(true);
    setTimeout(() => setCalorieAnimation(false), 1500);
    
    // Feedback haptique
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (isLastSet) {
      if (isLastExercise) {
        // Fin de l'entraînement complet
        setWorkoutComplete(true);
      } else {
        // Passer au prochain exercice
        setIsExerciseTransition(true);
        setInPause(true);
        setCurrentSetIndex(0);
      }
    } else {
      // Passer à la prochaine série avec une pause
      setInPause(true);
    }
  };
  
  // Gérer la fin d'une pause
  const handlePauseComplete = () => {
    setInPause(false);
    
    if (isExerciseTransition) {
      // Avancer au prochain exercice
      setCurrentExerciseIndex(prev => prev + 1);
      setIsExerciseTransition(false);
    } else {
      // Avancer à la prochaine série
      setCurrentSetIndex(prev => prev + 1);
    }
  };
  
  // Gérer le saut de la pause
  const handleSkipPause = () => {
    handlePauseComplete();
  };
  
  // Gérer l'achèvement de l'entraînement
  const handleWorkoutComplete = () => {
    // Sauvegarder les données d'entraînement (à implémenter)
    // saveWorkoutHistory({ ...workout, date: new Date(), calories: totalCalories });
    
    Alert.alert(
      "Félicitations !",
      `Tu as terminé ta séance et brûlé ${totalCalories} calories !`,
      [{ text: "Super !", onPress: () => router.navigate("/(tabs)/") }]
    );
  };
  
  // Gérer l'annulation de l'entraînement
  const handleCancel = () => {
    Alert.alert(
      "Quitter l'entraînement",
      "Es-tu sûr de vouloir quitter cette séance ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Quitter", style: "destructive", onPress: () => router.navigate("/(tabs)/") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.title}</Text>
        <View style={styles.calorieCounter}>
          <MaterialCommunityIcons name="fire" size={20} color="#f97316" />
          <Text style={styles.calorieText}>{totalCalories}</Text>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${((currentExerciseIndex * totalSets + currentSetIndex) / 
                      (workout.exercises.reduce((acc, ex) => 
                        acc + getSetCount(ex.sets || "1 x 1"), 0))) * 100}%` 
            }
          ]} 
        />
      </View>
      
      {inPause ? (
        <PauseScreen 
          duration={pauseDuration} 
          onComplete={handlePauseComplete} 
          onSkip={handleSkipPause}
          isExerciseTransition={isExerciseTransition}
        />
      ) : (
        <View style={styles.exerciseContainer}>
          <View style={styles.exerciseHeader}>
            <MaterialCommunityIcons 
              name={currentExercise.icon || "dumbbell"} 
              size={48} 
              color="#3b82f6" 
            />
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.setInfo}>
              Série {currentSetIndex + 1}/{totalSets}
            </Text>
          </View>
          
          {currentExercise.timer ? (
            <View style={styles.timerContainer}>
              <Timer 
                duration={currentExercise.duration || 30} 
                running={true} 
                onComplete={handleSetComplete} 
              />
              <Text style={styles.timerLabel}>Maintient la position</Text>
            </View>
          ) : (
            <View style={styles.repContainer}>
              <Text style={styles.repText}>
                {currentExercise.sets?.split("×")[1]?.trim() || "12 répétitions"}
              </Text>
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={handleSetComplete}
              >
                <Text style={styles.doneButtonText}>Terminé</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {/* Animation des calories gagnées */}
      {calorieAnimation && (
        <View style={styles.calorieAnimation}>
          <Text style={styles.calorieAnimationText}>
            +{currentExercise.calories || 5} calories !
          </Text>
        </View>
      )}
      
      {/* Modal de fin d'entraînement */}
      <Modal
        visible={workoutComplete}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="trophy" size={60} color="#f59e0b" />
            <Text style={styles.modalTitle}>Félicitations !</Text>
            <Text style={styles.modalSubtitle}>{workout.title} terminé</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={28} color="#f97316" />
                <Text style={styles.statValue}>{totalCalories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="dumbbell" size={28} color="#3b82f6" />
                <Text style={styles.statValue}>{workout.exercises.length}</Text>
                <Text style={styles.statLabel}>Exercices</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock-outline" size={28} color="#10b981" />
                <Text style={styles.statValue}>20 min</Text>
                <Text style={styles.statLabel}>Durée</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleWorkoutComplete}
            >
              <Text style={styles.completeButtonText}>Terminer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  calorieCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  calorieText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  exerciseContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  setInfo: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 8,
  },
  repContainer: {
    alignItems: "center",
  },
  repText: {
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 8,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  timerContainer: {
    alignItems: "center",
  },
  timer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  timerLabel: {
    fontSize: 18,
    color: "#374151",
  },
  pauseContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  pauseTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  pauseSubtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center",
  },
  skipButton: {
    marginTop: 32,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "500",
  },
  calorieAnimation: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    backgroundColor: "rgba(249, 115, 22, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  calorieAnimationText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    color: "#4b5563",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  completeButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
