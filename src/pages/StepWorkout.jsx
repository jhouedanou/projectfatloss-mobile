import React, { useState, useEffect, useRef } from 'react';
import { getWorkoutPlan } from '../services/WorkoutCustomization';
import { days } from '../data';
import ExoIcon, { EquipIcon } from '../components/ExoIcon';
import ProgressBar from '../components/ProgressBar';
// Load icons map
import iconsMap from '../../public/exo-icons.json';

// Son de notification
const beepSound = new Audio('/beep.mp3');

function playBeep() {
  // Clone l'audio pour pouvoir jouer plusieurs instances simultanément
  const beep = beepSound.cloneNode();
  beep.volume = 0.7;
  beep.play().catch(err => console.error("Erreur de lecture audio:", err));
}

function parseSets(sets) {
  // Ex: "4 × 12-15" => 4
  const m = sets.match(/(\d+)\s*[x×]/i);
  return m ? parseInt(m[1], 10) : 1;
}

function Pause({ onEnd, onSkip, isExerciseTransition, reducedTime }) {
  // isExerciseTransition = true signifie qu'on est dans une pause entre exercices (inactif)
  // isExerciseTransition = false signifie qu'on est dans une pause normale (bouton actif)
  const defaultTime = reducedTime ? 10 : 15; // 10 secondes en mode Fat Burner, 15 secondes sinon
  const [time, setTime] = useState(defaultTime); // 15 secondes de repos pour tous les types de pause
  
  useEffect(() => {
    if (time === 0) {
      onEnd();
      return;
    }
    
    // Jouer les bips à 6, 3, 2, 1 secondes avant la fin
    if (time === 6 || time === 3 || time === 2 || time === 1) {
      playBeep();
    } else if (time === 0) {
      // Deux bips rapides à la fin
      playBeep();
      setTimeout(() => playBeep(), 200);
    }
    
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, onEnd, isExerciseTransition]);
  
  return (
    <div style={{textAlign:'center',marginTop:40}}>
      <h2>Pause {reducedTime && "Rapide"}</h2>
      <div style={{fontSize:40,margin:20}}>{time}s</div>
      <p>Prépare-toi pour {isExerciseTransition ? "le prochain exercice" : "la prochaine série"} !</p>
      <button 
        className="timer-btn" 
        style={{
          marginTop:20, 
          opacity: isExerciseTransition ? 0.5 : 1,
          cursor: isExerciseTransition ? 'not-allowed' : 'pointer'
        }} 
        onClick={isExerciseTransition ? undefined : onSkip}
        disabled={isExerciseTransition}
      >
        Passer la pause
      </button>
    </div>
  );
}

// Component for displaying animated calories
function CalorieDisplay({ calories, visible }) {
  return (
    <div className={`calorie-display ${visible ? 'visible' : ''}`}>
      <span>+{calories} calories brûlées !</span>
    </div>
  );
}

// Component for floating calorie counter
function FloatingCalorieCounter({ calories, exerciseCompleted, fatBurnerMode }) {
  const [pulse, setPulse] = useState(false);
  
  // Effet pour déclencher l'animation de pouls quand les calories changent
  useEffect(() => {
    if (calories > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [calories]);
  
  return (
    <div className={`floating-calories ${exerciseCompleted ? 'completed' : ''} ${pulse ? 'pulse' : ''}`}>
      <p className="floating-calories-value">{calories}</p>
      <p className="floating-calories-label">CALORIES</p>
    </div>
  );
}

// Component for end of day summary modal
function EndOfDayModal({ day, totalCalories, onClose, onSaveWorkout, fatBurnerMode }) {
  // Fonction pour calculer le poids total en fonction de l'équipement
  function calculateWeight(equipment) {
    // Extraire les nombres de la chaîne d'équipement (ex: "Haltères 15 kg" -> 15)
    const match = equipment && equipment.match(/(\d+)\s*kg/i);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  // Calculer le poids total soulevé pendant la séance
  const totalWeightLifted = day.exercises.reduce((total, exercise) => {
    const weight = calculateWeight(exercise.equip);
    const sets = parseSets(exercise.sets);
    // Estimation des répétitions basée sur le format "4 × 12-15"
    let reps = 0;
    const repsMatch = exercise.sets.match(/\d+\s*[x×]\s*(\d+)(?:-(\d+))?/i);
    if (repsMatch) {
      if (repsMatch[2]) {
        // Si format "12-15", prendre la moyenne
        reps = Math.round((parseInt(repsMatch[1], 10) + parseInt(repsMatch[2], 10)) / 2);
      } else {
        reps = parseInt(repsMatch[1], 10);
      }
    }
    return total + (weight * sets * reps);
  }, 0);
  
  const handleSave = () => {
    // Préparer les données de l'entraînement à sauvegarder
    const workoutData = {
      title: day.title,
      date: new Date().toISOString(),
      calories: totalCalories,
      weightLifted: totalWeightLifted,
      exerciseCount: day.exercises.length,
      exercises: day.exercises.map(exercise => ({
        name: exercise.name,
        sets: parseSets(exercise.sets),
        weightLifted: calculateWeight(exercise.equip)
      })),
      fatBurnerMode: fatBurnerMode
    };
    
    // Sauvegarder dans le stockage local
    const savedWorkout = saveWorkout(workoutData);
    
    // Appeler le callback de sauvegarde
    onSaveWorkout && onSaveWorkout(savedWorkout);
    
    // Fermer la modale
    onClose();
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Félicitations !</h2>
        <div className="completion-icon">🔥</div>
        <h3>Séance terminée : {day.title}</h3>
        <p className="calorie-total">Vous avez brûlé <span>{totalCalories}</span> calories !</p>
        <p className="weight-total">Poids total soulevé : <span>{totalWeightLifted} kg</span></p>
        <p className="motivation-text">Excellent travail ! Continuez ainsi pour atteindre vos objectifs.</p>
        <div className="modal-actions">
          <button className="timer-btn save-btn" onClick={handleSave}>Enregistrer</button>
          <button className="timer-btn close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

function StepSet({ exo, setNum, totalSets, onDone, onCaloriesBurned, fatBurnerMode }) {
  const [timer, setTimer] = useState(exo.timer ? (exo.duration || 30) : null); // 30 secondes par défaut
  const [running, setRunning] = useState(false);
  const [showCalories, setShowCalories] = useState(false);
  
  // Always use the maximum calories per set value
  const caloriesPerSet = exo.caloriesPerSet ? 
    exo.caloriesPerSet[1] : // Take the maximum value (second value in the array)
    Math.round(10 + Math.random() * 5); // Increased fallback if no data provided
  
  useEffect(() => {
    if (!exo.timer || !running) return;
    if (timer === 0) return;
    
    // Jouer des bips à certains moments clés du chronomètre
    if (timer === 10 || timer === 5 || timer === 4 || timer === 3 || timer === 2 || timer === 1) {
      playBeep();
    }
    
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, running, exo.timer]);
  
  useEffect(() => { if (timer === 0 && running) handleDone(); }, [timer, running]);
  
  const iconType = iconsMap[exo.name] || 'dumbbell';
  
  const handleDone = () => {
    // Show calories animation
    setShowCalories(true);
    
    // Notify parent about calories burned
    onCaloriesBurned(caloriesPerSet);
    
    // Hide calories animation after 2 seconds
    setTimeout(() => {
      setShowCalories(false);
      onDone();
    }, 2000);
  };
  
  // Format le temps pour l'affichage mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Calcule le pourcentage du temps écoulé
  const calculateProgress = () => {
    if (!exo.timer || !exo.duration) return 0;
    return 100 - (timer / exo.duration * 100);
  };
  
  // Détermine la classe du timer en fonction du temps restant
  const getTimerClass = () => {
    if (!exo.timer) return '';
    if (timer <= 5) return 'critical';
    if (timer <= 10) return 'warning';
    return '';
  };
  
  return (
    <div className="exo-card" style={{textAlign:'center',marginTop:32}}>
      <ExoIcon type={iconType} size={48} />
      <div className="exo-title" style={{fontSize:'1.3rem',margin:'12px 0'}}>{exo.name}</div>
      <div className="exo-series">Série <span className="series-current">{setNum+1}</span> / {totalSets} &nbsp; <span style={{color:'#ff0000'}}>{exo.sets}</span></div>
      <div className="exo-equip"><EquipIcon equip={exo.equip} />{exo.equip}</div>
      <div className="exo-desc" style={{marginBottom:16}}>{exo.desc}</div>
      {exo.timer ? (
        <div className="exercise-timer">
          <div className="timer-label">
            {running ? 'En cours...' : 'Prêt ?'}
          </div>
          <div className={`timer-display ${getTimerClass()}`}>
            {formatTime(timer)}
          </div>
          <div className="timer-progress">
            <div 
              className="timer-progress-bar" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          {!running ? (
            <button className="timer-btn" onClick={()=>setRunning(true)}>Démarrer</button>
          ) : (
            <button className="timer-btn" onClick={()=>{setRunning(false);setTimer(exo.duration||30);}}>Réinitialiser</button>
          )}
        </div>
      ) : (
        <button className="timer-btn" onClick={handleDone} style={{marginTop:16}}>Terminer la série</button>
      )}
      
      <CalorieDisplay calories={caloriesPerSet} visible={showCalories} />
    </div>
  );
}

import { saveWorkout } from '../services/WorkoutStorage';

export default function StepWorkout({ dayIndex, onBack, onComplete, fatBurnerMode }) {
  const [step, setStep] = useState(0); // exercice
  const [pause, setPause] = useState(false);
  const [isExerciseTransition, setIsExerciseTransition] = useState(false); // Indique si on est dans une transition entre exercices
  const [setNum, setSetNum] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [showEndOfDayModal, setShowEndOfDayModal] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false); // Nouvel état pour suivre si l'entraînement est terminé
  const isFirstRender = useRef(true);
  
  // Utiliser le programme d'entraînement personnalisé
  const workoutPlan = getWorkoutPlan();
  const day = workoutPlan[dayIndex];
  const total = day.exercises.length;
  const exo = day.exercises[step];
  const totalSets = fatBurnerMode 
    ? Math.max(1, Math.floor(parseSets(exo.sets) / 2)) // Réduire de moitié le nombre de séries en mode Fat Burner (minimum 1)
    : parseSets(exo.sets);
  
  // En mode Fat Burner, on augmente le facteur de calories brûlées
  const fatBurnerCalorieFactor = fatBurnerMode ? 1.5 : 1;
  
  useEffect(()=>{
    setStep(0);
    setPause(false);
    setIsExerciseTransition(false);
    setSetNum(0);
    setTotalCaloriesBurned(0);
    setShowEndOfDayModal(false);
  },[dayIndex]);
  
  // Effet pour jouer le bip sonore lors du changement d'exercice
  useEffect(() => {
    // Ne pas jouer le son au premier rendu
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Jouer le son quand on passe à un nouvel exercice ou à une nouvelle série
    if (step > 0 || setNum > 0) {
      try {
        playBeep();
      } catch (error) {
        console.error("Erreur lors de la lecture du son :", error);
      }
    }
  }, [step, setNum]);
  
  const handlePauseEnd = () => {
    setPause(false);
    setIsExerciseTransition(false);
  };
  
  const handleSkipPause = () => {
    // Ne peut être appelé que si ce n'est pas une transition entre exercices
    if (!isExerciseTransition) {
      setPause(false);
    }
  };
  
  const handleCaloriesBurned = (calories) => {
    // Appliquer le facteur de calories du mode Fat Burner
    const adjustedCalories = Math.round(calories * fatBurnerCalorieFactor);
    setTotalCaloriesBurned(prev => prev + adjustedCalories);
  };
  
  const next = () => {
    if (setNum < totalSets - 1) {
      setSetNum(s => s + 1);
      setPause(true);
      setIsExerciseTransition(fatBurnerMode ? true : false); // En mode Fat Burner, on réduit le temps de pause entre les séries
    } else if (step < total - 1) {
      setPause(true);
      setIsExerciseTransition(true); // Pause forcée entre exercices
      setSetNum(0);
      setStep(s => s + 1);
    } else {
      // Workout completed - show end of day modal instead of simple message
      setWorkoutCompleted(true); // Marquer l'entraînement comme terminé
      setShowEndOfDayModal(true);
    }
  };
  
  const handleCloseEndOfDayModal = () => {
    setShowEndOfDayModal(false);
    onBack(); // Return to workout list
  };
  
  const handleSaveWorkout = (workoutData) => {
    // Ajouter l'information sur le mode Fat Burner
    const workoutDataWithMode = {
      ...workoutData,
      fatBurnerMode: fatBurnerMode
    };
    
    // Appeler le callback pour enregistrer les données
    onComplete && onComplete(workoutDataWithMode);
  };
  
  return (
    <div className="day-content">
      <button className="timer-btn" style={{marginBottom:10}} onClick={onBack}>Retour</button>
      <h2 style={{fontSize:'1.1rem',marginBottom:8}}>{day.title}</h2>
      
      {/* Afficher une bannière Fat Burner si nécessaire */}
      {fatBurnerMode && (
        <div className="fat-burner-indicator">
          🔥 Mode Fat Burner actif ! 🔥
        </div>
      )}
      
      <ProgressBar current={step+1} total={total} />
      <div style={{textAlign:'right',marginBottom:8}}>{step+1} / {total}</div>
      
      {/* Current calories counter */}
      <div className="calories-counter">
        Calories brûlées: <span>{totalCaloriesBurned}</span>
      </div>
      
      {/* Floating calorie counter */}
      <FloatingCalorieCounter 
        calories={totalCaloriesBurned} 
        exerciseCompleted={workoutCompleted}
        fatBurnerMode={fatBurnerMode} 
      />
      
      {pause ? (
        <Pause 
          onEnd={handlePauseEnd} 
          onSkip={handleSkipPause} 
          isExerciseTransition={isExerciseTransition}
          reducedTime={fatBurnerMode}
        />
      ) : (
        <StepSet 
          exo={exo} 
          setNum={setNum} 
          totalSets={totalSets} 
          onDone={next}
          onCaloriesBurned={handleCaloriesBurned}
          fatBurnerMode={fatBurnerMode}
        />
      )}
      
      {/* End of day modal */}
      {showEndOfDayModal && (
        <EndOfDayModal 
          day={day} 
          totalCalories={totalCaloriesBurned} 
          onClose={handleCloseEndOfDayModal}
          onSaveWorkout={handleSaveWorkout}
          fatBurnerMode={fatBurnerMode}
        />
      )}
    </div>
  );
}
