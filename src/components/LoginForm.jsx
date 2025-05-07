import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '../services/AuthService';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess, onClose }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Réinitialiser l'erreur
    setError('');
    
    // Valider les champs
    if (!username || !password) {
      setError(t('auth.errorRequiredFields'));
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Appeler le service d'authentification
      const result = await login(username, password);
      
      if (result.success) {
        // Notification de succès
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(t('auth.welcomeBack'), {
            body: t('auth.syncReady'),
            icon: '/favicon.ico'
          });
        }
        
        // Appeler le callback de succès
        onLoginSuccess(result.user);
      } else {
        setError(result.error || t('auth.errorUnknown'));
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(t('auth.errorUnknown'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h2>{t('auth.login')}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      {error && (
        <div className="login-error-message">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">{t('auth.username')}</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder={t('auth.usernamePlaceholder')}
            autoComplete="username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
          />
        </div>
        
        <div className="login-info-message">
          <p>{t('auth.loginHint')}</p>
          <p className="credentials-hint"></p>
        </div>
        
        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
