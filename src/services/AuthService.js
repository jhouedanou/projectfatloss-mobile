/**
 * Service d'authentification pour l'application
 * Gère la connexion, la déconnexion et la vérification de l'état de connexion
 */

// Définition des identifiants autorisés (dans un vrai contexte, cela serait géré côté serveur)
const AUTHORIZED_USER = {
  username: 'jhouedanou',
  password: 'karniella'
};

// Clé de stockage dans localStorage
const AUTH_KEY = 'auth_user_data';

/**
 * Connexion d'un utilisateur
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Object} - Résultat de la connexion avec token si réussie
 */
export const login = (username, password) => {
  try {
    // Vérifier les identifiants
    if (username === AUTHORIZED_USER.username && password === AUTHORIZED_USER.password) {
      // Créer un token simple (simulé)
      const token = `${username}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Créer les données utilisateur
      const userData = {
        username,
        token,
        lastSyncTime: Date.now(),
        isAuthenticated: true
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      
      return {
        success: true,
        user: userData
      };
    }
    
    return {
      success: false,
      error: 'Identifiants incorrects'
    };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return {
      success: false,
      error: 'Erreur lors de la connexion'
    };
  }
};

/**
 * Déconnexion de l'utilisateur
 * @returns {boolean} - Succès de l'opération
 */
export const logout = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur est connecté
 * @returns {Object|null} - Données utilisateur si connecté, null sinon
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(AUTH_KEY);
    if (!userData) {
      return null;
    }
    
    const user = JSON.parse(userData);
    return user.isAuthenticated ? user : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};

/**
 * Mettre à jour le timestamp de dernière synchronisation
 * @returns {boolean} - Succès de l'opération
 */
export const updateLastSyncTime = () => {
  try {
    const userData = getCurrentUser();
    if (!userData) {
      return false;
    }
    
    userData.lastSyncTime = Date.now();
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du timestamp de synchronisation:', error);
    return false;
  }
};
