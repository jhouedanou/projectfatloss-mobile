import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const WORKOUT_HISTORY_KEY = 'workoutHistory';
const WORKOUT_STATS_KEY = 'workoutStats';

/**
 * Sauvegarde une séance d'entraînement dans l'historique
 * @param {Object} workout - Données de la séance
 * @returns {Promise<void>}
 */
export async function saveWorkout(workout) {
  try {
    const history = await getWorkoutHistory();
    
    // Ajouter la date si elle n'est pas déjà présente
    if (!workout.date) {
      workout.date = new Date().toISOString();
    }
    
    history.push(workout);
    
    // Trier l'historique par date (du plus récent au plus ancien)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    await AsyncStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
    
    // Mettre à jour les statistiques
    await updateWorkoutStats(workout);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la séance:', error);
    throw error;
  }
}

/**
 * Récupère l'historique des séances d'entraînement
 * @returns {Promise<Array>} - Liste des séances
 */
export async function getWorkoutHistory() {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des séances:', error);
    return [];
  }
}

/**
 * Met à jour les statistiques d'entraînement
 * @param {Object} workout - Données de la séance à ajouter aux statistiques
 * @returns {Promise<void>}
 */
async function updateWorkoutStats(workout) {
  try {
    const stats = await getWorkoutStats();
    
    // Incrémenter le nombre de séances
    stats.totalSessions = (stats.totalSessions || 0) + 1;
    
    // Ajouter les calories brûlées
    if (workout.calories) {
      stats.totalCalories = (stats.totalCalories || 0) + workout.calories;
    }
    
    // Ajouter le temps d'entraînement (en minutes)
    if (workout.duration) {
      stats.totalDuration = (stats.totalDuration || 0) + workout.duration;
    }
    
    // Ajouter le poids soulevé
    if (workout.weightLifted) {
      stats.totalWeightLifted = (stats.totalWeightLifted || 0) + workout.weightLifted;
    }
    
    // Sauvegarder les statistiques mises à jour
    await AsyncStorage.setItem(WORKOUT_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error);
  }
}

/**
 * Récupère les statistiques d'entraînement
 * @returns {Promise<Object>} - Statistiques d'entraînement
 */
export async function getWorkoutStats() {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_STATS_KEY);
    return data ? JSON.parse(data) : {
      totalSessions: 0,
      totalCalories: 0,
      totalDuration: 0,
      totalWeightLifted: 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      totalSessions: 0,
      totalCalories: 0,
      totalDuration: 0,
      totalWeightLifted: 0
    };
  }
}

/**
 * Calcule les statistiques à partir de l'historique des séances
 * Utile pour recalculer toutes les statistiques si nécessaire
 * @returns {Promise<Object>} - Statistiques recalculées
 */
export async function recalculateWorkoutStats() {
  try {
    const history = await getWorkoutHistory();
    
    const stats = {
      totalSessions: history.length,
      totalCalories: 0,
      totalDuration: 0,
      totalWeightLifted: 0
    };
    
    // Calculer les totaux à partir de l'historique
    history.forEach(workout => {
      if (workout.calories) stats.totalCalories += workout.calories;
      if (workout.duration) stats.totalDuration += workout.duration;
      if (workout.weightLifted) stats.totalWeightLifted += workout.weightLifted;
    });
    
    // Sauvegarder les statistiques recalculées
    await AsyncStorage.setItem(WORKOUT_STATS_KEY, JSON.stringify(stats));
    
    return stats;
  } catch (error) {
    console.error('Erreur lors du recalcul des statistiques:', error);
    throw error;
  }
}
