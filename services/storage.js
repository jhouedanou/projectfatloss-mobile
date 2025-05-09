import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveWorkout(workout) {
  const history = await getWorkoutHistory();
  history.push(workout);
  await AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
}

export async function getWorkoutHistory() {
  const data = await AsyncStorage.getItem('workoutHistory');
  return data ? JSON.parse(data) : [];
}
