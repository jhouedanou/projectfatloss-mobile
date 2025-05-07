import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getWorkoutPlan } from '../services/WorkoutCustomization'; // Importer le service de personnalisation
import { days } from '../data';
import StepWorkout from './StepWorkout';
import WorkoutCalendar from '../components/WorkoutCalendar';
import WorkoutStats from '../components/WorkoutStats';
import WeightTracker from '../components/WeightTracker';
import LanguageSelector from '../components/LanguageSelector';
import WorkoutCustomizer from '../components/WorkoutCustomizer'; // Importer le composant de personnalisation
import '../components/WeightTracker.css';
import '../components/WorkoutCustomizer.css'; // Importer les styles CSS

function Tabs({ days, current, setCurrent }) {
  const { t } = useTranslation();
  return (
    <nav className="tabs">
      {days.map((d, i) => (
        <div
          key={i}
          className={"tab" + (i === current ? " active" : "")}
          onClick={() => setCurrent(i)}
        >
          {t('app.tabs.day')} {i + 1}
        </div>
      ))}
    </nav>
  );
}

export default function App() {
  const { t } = useTranslation();
  // Restaurer le jour actuel depuis localStorage
  const [current, setCurrent] = useState(() => {
    const savedDay = localStorage.getItem('currentWorkoutDay');
    return savedDay !== null ? parseInt(savedDay, 10) : 0;
  });
  const [stepMode, setStepMode] = useState(false);
  const [viewMode, setViewMode] = useState('workout'); // 'workout', 'history' ou 'weight'
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    return savedTheme === 'true';
  });
  // État pour contrôler l'affichage du sélecteur de langue
  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    const savedPref = localStorage.getItem('showLanguageSelector');
    return savedPref === null ? true : savedPref === 'true';
  });
  
  // État pour le mode d'urgence "Fat Burner"
  const [fatBurnerMode, setFatBurnerMode] = useState(false);
  
  // État pour le programme d'entraînement personnalisé
  const [workoutPlan, setWorkoutPlan] = useState([]);
  
  // État pour afficher/masquer le customizer
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Charger le programme d'entraînement personnalisé
  useEffect(() => {
    const plan = getWorkoutPlan();
    setWorkoutPlan(plan);
  }, []);
  
  // Rafraîchir le programme quand le customizer est fermé
  const handleCloseCustomizer = () => {
    setShowCustomizer(false);
    // Recharger le programme mis à jour
    const plan = getWorkoutPlan();
    setWorkoutPlan(plan);
  };
  
  // Sauvegarder le jour actuel dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('currentWorkoutDay', current.toString());
  }, [current]);

  useEffect(() => {
    // Appliquer le thème à chaque changement
    if (darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    // Sauvegarder la préférence
    localStorage.setItem('darkTheme', darkTheme);
  }, [darkTheme]);

  // Sauvegarder la préférence du sélecteur de langue dans localStorage
  useEffect(() => {
    localStorage.setItem('showLanguageSelector', showLanguageSelector);
  }, [showLanguageSelector]);

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(prev => !prev);
  };
  
  const toggleFatBurnerMode = () => {
    setFatBurnerMode(prev => !prev);
  };
  
  const moveToNextDay = () => {
    // Passer au jour suivant en suivant la séquence de 7 jours
    setCurrent(prev => (prev + 1) % workoutPlan.length);
    setStepMode(false); // Réinitialiser en mode non-étape
  };
  
  const handleWorkoutComplete = (workoutData) => {
    // Cette fonction sera passée à StepWorkout pour enregistrer les données d'entraînement
    // lorsqu'une séance est terminée
    console.log('Entraînement terminé:', workoutData);
    
    // Affichage d'une notification si l'API est disponible
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(t('notifications.workoutComplete'), {
        body: t('notifications.nextDay', { day: (current + 1) % workoutPlan.length + 1 }),
        icon: '/favicon.ico'
      });
    }
    
    // Passage automatique au jour suivant d'entraînement
    moveToNextDay();
    
    // Après l'enregistrement, passer à la vue historique
    setViewMode('history');
  };
  
  // Demander la permission pour les notifications lors du premier chargement
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div>
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme} title={darkTheme ? t('theme.light') : t('theme.dark')}>
          {darkTheme ? '☀️' : '🌙'}
        </button>
        <span className="header-title">{t('app.title')}</span>
        <div className="header-controls">
          <button 
            className={`view-toggle ${viewMode === 'workout' ? 'active' : ''}`}
            onClick={() => setViewMode('workout')}
            title={t('nav.workout')}
          >
            <span className="view-icon">🏋️</span>
            <span className="view-text">{t('nav.workout')}</span>
          </button>
          <button 
            className={`view-toggle ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => setViewMode('history')}
            title={t('nav.history')}
          >
            <span className="view-icon">📊</span>
            <span className="view-text">{t('nav.history')}</span>
          </button>
          <button 
            className={`view-toggle ${viewMode === 'weight' ? 'active' : ''}`}
            onClick={() => setViewMode('weight')}
            title={t('nav.weight')}
          >
            <span className="view-icon">⚖️</span>
            <span className="view-text">{t('nav.weight')}</span>
          </button>
        </div>
      </header>
      
      {/* Menu de configuration - ajouté pour permettre de masquer le sélecteur de langue */}
      <div className="settings-bar">
        <button 
          className="settings-button"
          onClick={toggleLanguageSelector}
          title={showLanguageSelector ? t('settings.hideLanguage') : t('settings.showLanguage')}
        >
          {showLanguageSelector ? t('settings.hideLanguage') : t('settings.showLanguage')} 🌐
        </button>
        
        {/* Bouton pour le mode Fat Burner */}
        <button 
          className={`settings-button ${fatBurnerMode ? 'active-mode' : ''}`}
          onClick={toggleFatBurnerMode}
          title={t('settings.fatBurnerMode')}
        >
          {t('settings.fatBurner')} 🔥
        </button>
        
        {/* Bouton pour personnaliser le programme */}
        <button 
          className="settings-button"
          onClick={() => setShowCustomizer(true)}
          title={t('settings.customizeProgram')}
        >
          {t('settings.customize')} ⚙️
        </button>
      </div>
      
      {/* Sélecteur de langue */}
      {showLanguageSelector && <LanguageSelector />}
      
      {/* Customizer de programme */}
      {showCustomizer && <WorkoutCustomizer onClose={handleCloseCustomizer} />}
      
      {viewMode === 'workout' ? (
        // Mode Entraînement
        <>
          <Tabs days={workoutPlan} current={current} setCurrent={i=>{setCurrent(i);setStepMode(false);}} />
          {!stepMode ? (
            <div className="day-content">
              <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{workoutPlan[current].title}</h2>
              
              {/* Bouton mode Fat Burner */}
              {fatBurnerMode && (
                <div className="fat-burner-banner">
                  <span className="fat-burner-icon">🔥</span>
                  <span className="fat-burner-text">{t('mode.fatBurner')}</span>
                </div>
              )}
              
              <button className="timer-btn" style={{marginBottom:16}} onClick={()=>setStepMode(true)}>
                {t('workout.start')}
              </button>
              {workoutPlan[current].exercises.map((exo, i) => (
                <div className="exo-card" key={i}>
                  <div className="exo-header">
                    <span className="exo-title">{exo.name}</span>
                    <span className="exo-series">{fatBurnerMode ? t('workout.fatBurnerSets', { sets: exo.sets }) : exo.sets}</span>
                  </div>
                  <div className="exo-equip">{t('workout.equipment')}: {exo.equip}</div>
                  <div className="exo-desc">{exo.desc}</div>
                </div>
              ))}
            </div>
          ) : (
            <StepWorkout 
              dayIndex={current} 
              onBack={()=>setStepMode(false)}
              onComplete={handleWorkoutComplete}
              fatBurnerMode={fatBurnerMode}
            />
          )}
        </>
      ) : viewMode === 'history' ? (
        // Mode Historique et Statistiques
        <div className="history-content">
          <WorkoutStats />
          <WorkoutCalendar />
        </div>
      ) : (
        // Mode Suivi de Poids
        <div className="weight-content">
          <WeightTracker />
        </div>
      )}
    </div>
  );
}
