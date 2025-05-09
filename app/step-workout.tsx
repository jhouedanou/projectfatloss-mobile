import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator, Linking } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { days, Exercise } from "../services/WorkoutData";
import { workoutProgram } from '../services/workoutData';  // Import direct du programme
import ExerciseVideoModal from "../components/ExerciseVideoModal";
import { saveWorkout } from '../services/storage';

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
function PauseScreen({ duration, onComplete, onSkip, isExerciseTransition, nextExercise }) {
  return (
    <View style={styles.pauseContainer}>
      <Text style={styles.pauseTitle}>Pause</Text>
      <Timer duration={duration} running={true} onComplete={onComplete} />
      
      {isExerciseTransition && nextExercise && (
        <View style={styles.nextExerciseInfo}>
          <Text style={styles.nextExerciseTitle}>Prochain exercice :</Text>
          <Text style={styles.nextExerciseName}>{nextExercise.name}</Text>
          <Text style={styles.nextExerciseEquip}>{nextExercise.equip}</Text>
          <Text style={styles.nextExerciseSets}>{nextExercise.sets}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Passer la pause</Text>
      </TouchableOpacity>
    </View>
  );
}

// Écran principal pour la séance étape par étape
export default function StepWorkout() {
  const { dayIndex = "0" } = useLocalSearchParams();
  const dayId = parseInt(dayIndex as string, 10) || 0;
  
  // État pour le workout
  const [workout, setWorkout] = useState<any>(null);

  // Charger le workout au démarrage
  useEffect(() => {
    setWorkout(workoutProgram[dayId]);
  }, [dayId]);

  // État pour suivre la progression
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [inPause, setInPause] = useState(false);
  const [isExerciseTransition, setIsExerciseTransition] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [calorieAnimation, setCalorieAnimation] = useState(false);
  
  // État pour le modal de vidéo
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  
  // Options
  const [fatBurnerMode, setFatBurnerMode] = useState(false);
  
  // Définir la durée de pause selon le mode
  const pauseDuration = fatBurnerMode ? 10 : 30;
  
  if (!workout) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement de la séance...</Text>
      </View>
    );
  }
  
  // Extraire le nombre de séries pour l'exercice actuel
  const getSetCount = (sets) => {
    const match = sets.match(/(\d+)\s*[x×]/i);
    return match ? parseInt(match[1]) : 1;
  };
  
  const currentExercise = workout.exercises[currentExerciseIndex] || {};
  const totalSets = getSetCount(currentExercise.sets || "1 x 1");
  const isLastSet = currentSetIndex === totalSets - 1;
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  
  // Ouvrir le modal de vidéo
  const handleOpenVideo = () => {
    if (currentExercise.videoId) {
      setVideoModalVisible(true);
    }
  };
  
  // Gérer l'achèvement d'une série
  const handleSetComplete = () => {
    // Ajouter des calories (utiliser la moyenne de caloriesPerSet)
    const caloriesPotential = currentExercise.caloriesPerSet || [5, 10];
    const caloriesEarned = Math.floor(
      caloriesPotential.reduce((a, b) => a + b, 0) / caloriesPotential.length
    );
    
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
  const handleWorkoutComplete = async () => {
    try {
      // Préparer les données de l'entraînement
      const workoutData = {
        title: workout.title,
        date: new Date().toISOString(),
        calories: totalCalories,
        exercises: workout.exercises.map(ex => ({
          name: ex.name,
          sets: getSetCount(ex.sets),
          equip: ex.equip
        })),
        duration: 20, // en minutes
        exerciseCount: workout.exercises.length
      };

      // Sauvegarder l'entraînement
      await saveWorkout(workoutData);

      // Afficher l'alerte de confirmation
      Alert.alert(
        "Félicitations ! 🎉",
        `Tu as terminé ta séance et brûlé ${totalCalories} calories !`,
        [
          { 
            text: "Super !", 
            onPress: () => {
              router.replace("/(tabs)/");  // Utiliser replace au lieu de navigate
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sauvegarde de l'entraînement"
      );
    }
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

  const nextExercise = workout.exercises[currentExerciseIndex + 1];

  const generateYouTubeLink = (exerciseName) => {
    const searchQuery = encodeURIComponent(`${exerciseName} exercice tutorial`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  const handleYouTubePress = async (exerciseName) => {
    setShowYoutubeModal(true);
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
          nextExercise={nextExercise}
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
            <Text style={styles.equipmentText}>{currentExercise.equip}</Text>
            <Text style={styles.setInfo}>
              Série {currentSetIndex + 1}/{totalSets} - {currentExercise.sets}
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
              <Text style={styles.descriptionText}>{currentExercise.desc}</Text>
              
              {currentExercise.videoId && (
                <TouchableOpacity 
                  style={styles.videoButton} 
                  onPress={handleOpenVideo}
                >
                  <MaterialCommunityIcons name="youtube" size={24} color="#f87171" />
                  <Text style={styles.videoButtonText}>Voir la vidéo</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.doneButton} 
                onPress={handleSetComplete}
              >
                <Text style={styles.doneButtonText}>Terminé</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={styles.youtubeButton}
            onPress={() => handleYouTubePress(currentExercise.name)}
          >
            <MaterialCommunityIcons name="youtube" size={24} color="#FF0000" />
            <Text style={styles.youtubeButtonText}>Voir des tutoriels</Text>
          </TouchableOpacity>

          {/* Modal YouTube */}
          <Modal
            visible={showYoutubeModal}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.youtubeModalContent}>
                <Text style={styles.modalTitle}>Tutoriels YouTube</Text>
                <Text style={styles.modalText}>
                  Voulez-vous voir des tutoriels pour {currentExercise.name} ?
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.modalButton}
                    onPress={() => {
                      Linking.openURL(generateYouTubeLink(currentExercise.name));
                      setShowYoutubeModal(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Ouvrir YouTube</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setShowYoutubeModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      
      {/* Animation des calories gagnées */}
      {calorieAnimation && (
        <View style={styles.calorieAnimation}>
          <Text style={styles.calorieAnimationText}>
            +{Math.floor(
              (currentExercise.caloriesPerSet || [5, 10]).reduce((a, b) => a + b, 0) / 
              (currentExercise.caloriesPerSet || [5, 10]).length
            )} calories !
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
      
      {/* Modal de vidéo d'exercice */}
      <ExerciseVideoModal
        isVisible={videoModalVisible}
        videoId={currentExercise.videoId || ""}
        exerciseName={currentExercise.name || ""}
        onClose={() => setVideoModalVisible(false)}
      />
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
  equipmentText: {
    fontSize: 16,
    color: '#3b82f6',
    marginTop: 8,
    fontWeight: '500',
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
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
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
  videoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  videoButtonText: {
    color: "#ef4444",
    fontWeight: "500",
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 18,
    color: "#374151",
    textAlign: "center",
    marginTop: 100,
  },
  nextExerciseInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  nextExerciseTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  nextExerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  nextExerciseEquip: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 4,
  },
  nextExerciseSets: {
    fontSize: 16,
    color: '#6b7280',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    lineHeight: 20,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  youtubeButtonText: {
    marginLeft: 8,
    color: '#FF0000',
    fontSize: 16,
    fontWeight: '500',
  },
  youtubeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4b5563',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#e5e7eb',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonTextCancel: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '500',
  },
});
