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

function StepSet({ exo, setNum, totalSets, onDone }) {
  const [timer, setTimer] = useState(exo.timer ? (exo.duration || 60) : null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!exo.timer || !running) return;
    if (timer === 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, running, exo.timer]);
  useEffect(() => { if (timer === 0 && running) onDone(); }, [timer, onDone, running]);
  const iconType = iconsMap[exo.name] || 'dumbbell';
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
        <button className="timer-btn" onClick={onDone} style={{marginTop:16}}>Terminer la série</button>
      )}
    </div>
  );
}

export default function StepWorkout({ dayIndex, onBack }) {
  const [step, setStep] = useState(0); // exercice
  const [pause, setPause] = useState(false);
  const [setNum, setSetNum] = useState(0);
  const day = days[dayIndex];
  const total = day.exercises.length;
  const exo = day.exercises[step];
  const totalSets = parseSets(exo.sets);
  useEffect(()=>{setStep(0);setPause(false);setSetNum(0);},[dayIndex]);
  const handlePauseEnd = () => setPause(false);
  const handleSkipPause = () => setPause(false);
  const next = () => {
    if (setNum < totalSets - 1) {
      setSetNum(s => s + 1);
    } else if (step < total - 1) {
      setPause(true);
      setSetNum(0);
      setStep(s => s + 1);
    }
  };
  return (
    <div className="day-content">
      <button className="timer-btn" style={{marginBottom:10}} onClick={onBack}>Retour</button>
      <h2 style={{fontSize:'1.1rem',marginBottom:8}}>{day.title}</h2>
      <ProgressBar current={step+1} total={total} />
      <div style={{textAlign:'right',marginBottom:8}}>{step+1} / {total}</div>
      {pause ? (
        <Pause onEnd={handlePauseEnd} onSkip={handleSkipPause} />
      ) : (
        <StepSet exo={exo} setNum={setNum} totalSets={totalSets} onDone={next} />
      )}
      {step === total - 1 && setNum === totalSets - 1 && !pause && (
        <div style={{textAlign:'center',marginTop:32}}>
          <h3>Bravo, séance terminée !</h3>
          <button className="timer-btn" onClick={onBack}>Retour à la liste</button>
        </div>
      )}
    </div>
  );
}
