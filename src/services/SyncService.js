/**
 * Service de synchronisation des données
 * Permet de synchroniser les données d'entraînement entre différents appareils
 */

import { getCurrentUser, updateLastSyncTime } from './AuthService';
import { getWorkoutHistory } from './WorkoutStorage';
import { getWorkoutPlan } from './WorkoutCustomization';
import { getWeightEntries } from './WeightStorage';

// URLs pour l'API fictive (dans une vraie application, cela serait remplacé par de vraies API)
// Nous simulons ces appels API avec localStorage pour cette démonstration
const SYNC_DATA_KEY = 'synced_app_data';

/**
 * Synchroniser les données avec le "cloud" (localement simulé)
 * @returns {Object} - Résultat de la synchronisation
 */
export const syncData = async () => {
  try {
    const user = getCurrentUser();
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non connecté'
      };
    }
    
    // Récupérer toutes les données locales à synchroniser
    const localData = {
      workoutHistory: getWorkoutHistory(),
      workoutPlan: getWorkoutPlan(),
      weightEntries: getWeightEntries(),
      timestamp: Date.now(),
      username: user.username
    };
    
    // Simuler l'envoi des données au serveur (stockées dans localStorage)
    localStorage.setItem(SYNC_DATA_KEY, JSON.stringify(localData));
    
    // Mettre à jour le timestamp de dernière synchronisation
    updateLastSyncTime();
    
    return {
      success: true,
      message: 'Données synchronisées avec succès',
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la synchronisation des données:', error);
    return {
      success: false,
      error: 'Erreur lors de la synchronisation'
    };
  }
};

/**
 * Récupérer les données synchronisées depuis le "cloud" (localement simulé)
 * @returns {Object} - Données récupérées ou erreur
 */
export const fetchSyncedData = async () => {
  try {
    const user = getCurrentUser();
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur non connecté'
      };
    }
    
    // Récupérer les données synchronisées (depuis localStorage dans notre simulation)
    const syncedDataJson = localStorage.getItem(SYNC_DATA_KEY);
    
    if (!syncedDataJson) {
      return {
        success: false,
        error: 'Aucune donnée synchronisée disponible'
      };
    }
    
    const syncedData = JSON.parse(syncedDataJson);
    
    // Vérifier que les données appartiennent à l'utilisateur connecté
    if (syncedData.username !== user.username) {
      return {
        success: false,
        error: 'Les données synchronisées n\'appartiennent pas à cet utilisateur'
      };
    }
    
    // Vérifier si les données sont plus récentes que la dernière synchronisation
    if (syncedData.timestamp <= user.lastSyncTime) {
      return {
        success: true,
        message: 'Aucune nouvelle donnée à synchroniser',
        noChange: true
      };
    }
    
    return {
      success: true,
      data: syncedData,
      syncedAt: new Date(syncedData.timestamp).toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données synchronisées:', error);
    return {
      success: false,
      error: 'Erreur lors de la récupération des données'
    };
  }
};

/**
 * Appliquer les données synchronisées aux données locales
 * @param {Object} syncedData - Données synchronisées à appliquer
 * @returns {boolean} - Succès de l'opération
 */
export const applySyncedData = (syncedData) => {
  try {
    if (!syncedData || !syncedData.workoutHistory || !syncedData.workoutPlan || !syncedData.weightEntries) {
      console.error('Données incomplètes', syncedData);
      return false;
    }
    
    // Appliquer les données synchronisées (dans une application réelle, cela déclencherait des mises à jour dans les stores Redux/Context)
    localStorage.setItem('workout_history_data', JSON.stringify(syncedData.workoutHistory));
    localStorage.setItem('custom_workout_plan', JSON.stringify(syncedData.workoutPlan));
    localStorage.setItem('weight_entries', JSON.stringify(syncedData.weightEntries));
    
    // Mettre à jour le timestamp de dernière synchronisation
    updateLastSyncTime();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'application des données synchronisées:', error);
    return false;
  }
};
