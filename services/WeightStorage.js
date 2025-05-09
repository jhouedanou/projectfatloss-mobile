import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé de stockage dans AsyncStorage
const WEIGHT_HISTORY_KEY = 'weight_history_data';

/**
 * Ajoute un enregistrement de poids
 * @param {number} weight - Le poids en kilogrammes
 * @param {string} date - La date de l'enregistrement (optionnelle, par défaut date actuelle)
 * @param {string} notes - Notes supplémentaires (optionnel)
 * @returns {Promise<Object>} - L'enregistrement créé
 */
export const addWeightRecord = async (weight, date = null, notes = '') => {
  try {
    if (!weight || isNaN(weight) || weight <= 0) {
      throw new Error('Poids invalide');
    }
    
    // Récupérer l'historique existant
    const history = await getWeightHistory();
    
    // Créer le nouvel enregistrement
    const newRecord = {
      id: Date.now(),
      weight: parseFloat(weight),
      date: date || new Date().toISOString(),
      notes
    };
    
    // Ajouter l'enregistrement à l'historique
    history.push(newRecord);
    
    // Trier l'historique par date (du plus ancien au plus récent)
    history.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Sauvegarder l'historique mis à jour
    await AsyncStorage.setItem(WEIGHT_HISTORY_KEY, JSON.stringify(history));
    
    return newRecord;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un enregistrement de poids:', error);
    throw error;
  }
};

/**
 * Récupère tout l'historique des poids
 * @returns {Promise<Array>} - Liste des enregistrements de poids
 */
export const getWeightHistory = async () => {
  try {
    const historyData = await AsyncStorage.getItem(WEIGHT_HISTORY_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des poids:', error);
    return [];
  }
};

/**
 * Supprime un enregistrement de poids par ID
 * @param {number} id - ID de l'enregistrement à supprimer
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const deleteWeightRecord = async (id) => {
  try {
    const history = await getWeightHistory();
    const updatedHistory = history.filter(record => record.id !== id);
    
    await AsyncStorage.setItem(WEIGHT_HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enregistrement de poids:', error);
    return false;
  }
};

/**
 * Récupère les statistiques sur l'évolution du poids
 * @returns {Promise<Object>} - Statistiques sur l'évolution du poids
 */
export const getWeightStats = async () => {
  try {
    const history = await getWeightHistory();
    
    if (history.length === 0) {
      return {
        current: null,
        initial: null,
        change: null,
        changePercentage: null,
        lowestRecord: null,
        highestRecord: null
      };
    }
    
    // Le poids actuel est le dernier enregistrement
    const current = history[history.length - 1];
    
    // Le poids initial est le premier enregistrement
    const initial = history[0];
    
    // Calculer le changement de poids
    const change = current.weight - initial.weight;
    
    // Calculer le pourcentage de changement
    const changePercentage = (change / initial.weight) * 100;
    
    // Trouver le poids le plus bas et le plus élevé
    const lowestRecord = history.reduce((min, record) => 
      record.weight < min.weight ? record : min, history[0]);
      
    const highestRecord = history.reduce((max, record) => 
      record.weight > max.weight ? record : max, history[0]);
    
    return {
      current,
      initial,
      change,
      changePercentage,
      lowestRecord,
      highestRecord
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques de poids:', error);
    return {
      current: null,
      initial: null,
      change: null,
      changePercentage: null,
      lowestRecord: null,
      highestRecord: null
    };
  }
};

/**
 * Récupère les enregistrements de poids pour la synchronisation
 * @returns {Promise<Array>} - Liste complète des enregistrements de poids
 */
export const getWeightEntries = async () => {
  try {
    return await getWeightHistory();
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées de poids:', error);
    return [];
  }
};
