// Service d'export des données vers Google Fit (Android)
// Nécessite : npm install react-native-google-fit
import GoogleFit, { Scopes } from 'react-native-google-fit';

export async function requestGoogleFitPermissions() {
  return new Promise((resolve, reject) => {
    GoogleFit.checkIsAuthorized().then(() => {
      if (!GoogleFit.isAuthorized) {
        GoogleFit.authorize({
          scopes: [
            Scopes.FITNESS_ACTIVITY_WRITE,
            Scopes.FITNESS_BODY_WRITE,
          ],
        }).then(authResult => {
          if (authResult.success) resolve(true);
          else reject(authResult.message);
        });
      } else {
        resolve(true);
      }
    });
  });
}

export async function exportWorkoutToGoogleFit({startDate, endDate, calories, steps, distance, activityName = 'Workout'}) {
  await requestGoogleFitPermissions();
  return GoogleFit.saveWorkout({
    startDate, // format : new Date().toISOString()
    endDate,
    calories,
    steps,
    distance,
    activityType: activityName,
    // Ajoute d'autres champs si besoin
  });
}
