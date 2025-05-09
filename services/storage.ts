import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const WORKOUT_HISTORY_KEY = 'workoutHistory';
const WORKOUT_STATS_KEY = 'workoutStats';

// Types
export interface WorkoutStats {
  totalSessions: number;
  totalCalories: number;
  totalDuration: number;
  totalWeightLifted: number;
}

export async function getWorkoutHistory() {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return [];
  }
}

export async function getWorkoutStats(): Promise<WorkoutStats> {
  try {
    const data = await AsyncStorage.getItem(WORKOUT_STATS_KEY);
    return data ? JSON.parse(data) : {
      totalSessions: 0,
      totalCalories: 0,
      totalDuration: 0,
      totalWeightLifted: 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return {
      totalSessions: 0,
      totalCalories: 0,
      totalDuration: 0,
      totalWeightLifted: 0
    };
  }
}

export async function updateWorkoutStats(workout: any) {
  try {
    const stats = await getWorkoutStats();
    const updatedStats = {
      totalSessions: stats.totalSessions + 1,
      totalCalories: stats.totalCalories + (workout.calories || 0),
      totalDuration: stats.totalDuration + (workout.duration || 0),
      totalWeightLifted: stats.totalWeightLifted + (workout.weightLifted || 0)
    };
    await AsyncStorage.setItem(WORKOUT_STATS_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des stats:', error);
    throw error;
  }
}