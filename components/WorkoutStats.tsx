import { useEffect, useState } from 'react';
import { getWorkoutStats } from '../services/firebaseStorage';

export default function WorkoutStats() {
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalWorkouts: 0,
    totalDuration: 0,
    exerciseCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const firebaseStats = await getWorkoutStats();
        setStats(firebaseStats);
      } catch (error) {
        console.error('Erreur de chargement des stats:', error);
      }
    };
    
    loadStats();
  }, []);

  return (
    // ... JSX code to display stats ...
  );
}