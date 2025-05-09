import { collection, addDoc, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveWorkoutToFirebase = async (workoutData) => {
  try {
    const workoutRef = collection(db, 'workouts');
    const workoutWithTimestamp = {
      ...workoutData,
      createdAt: Timestamp.now(),
      userId: 'anonymous' // À remplacer par l'ID utilisateur une fois l'authentification mise en place
    };
    
    const docRef = await addDoc(workoutRef, workoutWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Erreur Firebase:', error);
    throw error;
  }
};

export const getWorkoutStats = async () => {
  try {
    const workoutRef = collection(db, 'workouts');
    const q = query(workoutRef, where('userId', '==', 'anonymous'));
    const querySnapshot = await getDocs(q);
    
    const stats = {
      totalCalories: 0,
      totalWorkouts: 0,
      totalDuration: 0,
      exerciseCount: 0
    };

    querySnapshot.forEach((doc) => {
      const workout = doc.data();
      stats.totalCalories += workout.calories || 0;
      stats.totalWorkouts += 1;
      stats.totalDuration += workout.duration || 0;
      stats.exerciseCount += workout.exerciseCount || 0;
    });

    return stats;
  } catch (error) {
    console.error('Erreur Firebase:', error);
    throw error;
  }
};
