import React, { useState, useEffect } from 'react';
import { days } from '../data';
import ExoIcon, { EquipIcon } from '../components/ExoIcon';
import ProgressBar from '../components/ProgressBar';
// Load icons map
import iconsMap from '../../public/exo-icons.json';

function parseSets(sets) {
  // Ex: "4 × 12-15" => 4
  const m = sets.match(/(\d+)\s*[x×]/i);
  return m ? parseInt(m[1], 10) : 1;
}

function Pause({ onEnd, onSkip }) {
  const [time, setTime] = useState(30);
  useEffect(() => {
    if (time === 0) {
      onEnd();
      return;
    }
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, onEnd]);
  return (
    <div style={{textAlign:'center',marginTop:40}}>
      <h2>Pause</h2>
      <div style={{fontSize:40,margin:20}}>{time}s</div>
      <p>Prépare-toi pour le prochain exercice !</p>
      <button className="timer-btn" style={{marginTop:20}} onClick={onSkip}>Passer la pause</button>
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

// Component for end of day summary modal
function EndOfDayModal({ day, totalCalories, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Félicitations !</h2>
        <div className="completion-icon">🔥</div>
        <h3>Séance terminée : {day.title}</h3>
        <p className="calorie-total">Vous avez brûlé <span>{totalCalories}</span> calories !</p>
        <p className="motivation-text">Excellent travail ! Continuez ainsi pour atteindre vos objectifs.</p>
        <button className="timer-btn" onClick={onClose}>Retour à la liste</button>
      </div>
    </div>
  );
}

function StepSet({ exo, setNum, totalSets, onDone, onCaloriesBurned }) {
  const [timer, setTimer] = useState(exo.timer ? (exo.duration || 60) : null);
  const [running, setRunning] = useState(false);
  const [showCalories, setShowCalories] = useState(false);
  
  // Estimate calories per set (calculate average if range is given)
  const caloriesPerSet = exo.caloriesPerSet ? 
    Math.round((exo.caloriesPerSet[0] + exo.caloriesPerSet[1]) / 2) : 
    Math.round(5 + Math.random() * 10); // Fallback if no data provided
  
  useEffect(() => {
    if (!exo.timer || !running) return;
    if (timer === 0) return;
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
  
  return (
    <div className="exo-card" style={{textAlign:'center',marginTop:32}}>
      <ExoIcon type={iconType} size={48} />
      <div className="exo-title" style={{fontSize:'1.3rem',margin:'12px 0'}}>{exo.name}</div>
      <div className="exo-series">Série {setNum+1} / {totalSets} &nbsp; <span style={{color:'#9a8c98'}}>{exo.sets}</span></div>
      <div className="exo-equip"><EquipIcon equip={exo.equip} />{exo.equip}</div>
      <div className="exo-desc" style={{marginBottom:16}}>{exo.desc}</div>
      {exo.timer ? (
        <div>
          <div style={{fontFamily:'monospace',fontSize:'1.2em',marginBottom:8}}>
            {String(Math.floor(timer/60)).padStart(2,'0')}:{String(timer%60).padStart(2,'0')}
          </div>
          {!running ? (
            <button className="timer-btn" onClick={()=>setRunning(true)}>Démarrer</button>
          ) : (
            <button className="timer-btn" onClick={()=>{setRunning(false);setTimer(exo.duration||60);}}>Réinitialiser</button>
          )}
        </div>
      ) : (
        <button className="timer-btn" onClick={handleDone} style={{marginTop:16}}>Terminer la série</button>
      )}
      
      <CalorieDisplay calories={caloriesPerSet} visible={showCalories} />
    </div>
  );
}

export default function StepWorkout({ dayIndex, onBack }) {
  const [step, setStep] = useState(0); // exercice
  const [pause, setPause] = useState(false);
  const [setNum, setSetNum] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [showEndOfDayModal, setShowEndOfDayModal] = useState(false);
  
  const day = days[dayIndex];
  const total = day.exercises.length;
  const exo = day.exercises[step];
  const totalSets = parseSets(exo.sets);
  
  useEffect(()=>{
    setStep(0);
    setPause(false);
    setSetNum(0);
    setTotalCaloriesBurned(0);
    setShowEndOfDayModal(false);
  },[dayIndex]);
  
  const handlePauseEnd = () => setPause(false);
  const handleSkipPause = () => setPause(false);
  
  const handleCaloriesBurned = (calories) => {
    setTotalCaloriesBurned(prev => prev + calories);
  };
  
  const next = () => {
    if (setNum < totalSets - 1) {
      setSetNum(s => s + 1);
    } else if (step < total - 1) {
      setPause(true);
      setSetNum(0);
      setStep(s => s + 1);
    } else {
      // Workout completed - show end of day modal instead of simple message
      setShowEndOfDayModal(true);
    }
  };
  
  const handleCloseEndOfDayModal = () => {
    setShowEndOfDayModal(false);
    onBack(); // Return to workout list
  };
  
  return (
    <div className="day-content">
      <button className="timer-btn" style={{marginBottom:10}} onClick={onBack}>Retour</button>
      <h2 style={{fontSize:'1.1rem',marginBottom:8}}>{day.title}</h2>
      <ProgressBar current={step+1} total={total} />
      <div style={{textAlign:'right',marginBottom:8}}>{step+1} / {total}</div>
      
      {/* Current calories counter */}
      <div className="calories-counter">
        Calories brûlées: <span>{totalCaloriesBurned}</span>
      </div>
      
      {pause ? (
        <Pause onEnd={handlePauseEnd} onSkip={handleSkipPause} />
      ) : (
        <StepSet 
          exo={exo} 
          setNum={setNum} 
          totalSets={totalSets} 
          onDone={next}
          onCaloriesBurned={handleCaloriesBurned} 
        />
      )}
      
      {/* End of day modal */}
      {showEndOfDayModal && (
        <EndOfDayModal 
          day={day} 
          totalCalories={totalCaloriesBurned} 
          onClose={handleCloseEndOfDayModal} 
        />
      )}
    </div>
  );
}
