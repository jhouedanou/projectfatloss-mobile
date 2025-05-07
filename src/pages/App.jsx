import React, { useState, useEffect } from 'react';
import { days } from '../data';
import StepWorkout from './StepWorkout';

function Tabs({ days, current, setCurrent }) {
  return (
    <nav className="tabs">
      {days.map((d, i) => (
        <div
          key={i}
          className={"tab" + (i === current ? " active" : "")}
          onClick={() => setCurrent(i)}
        >
          Jour {i + 1}
        </div>
      ))}
    </nav>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [stepMode, setStepMode] = useState(false);
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    return savedTheme === 'true';
  });

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

  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
  };

  return (
    <div>
      <header className="app-header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkTheme ? '☀️' : '🌙'}
        </button>
        <span className="header-title">Semaine Muscu Mobile</span>
        <div style={{ width: '30px' }}></div> {/* Pour équilibrer l'en-tête */}
      </header>
      <Tabs days={days} current={current} setCurrent={i=>{setCurrent(i);setStepMode(false);}} />
      {!stepMode ? (
        <div className="day-content">
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>{days[current].title}</h2>
          <button className="timer-btn" style={{marginBottom:16}} onClick={()=>setStepMode(true)}>Commencer la séance</button>
          {days[current].exercises.map((exo, i) => (
            <div className="exo-card" key={i}>
              <div className="exo-header">
                <span className="exo-title">{exo.name}</span>
                <span className="exo-series">{exo.sets}</span>
              </div>
              <div className="exo-equip">{exo.equip}</div>
              <div className="exo-desc">{exo.desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <StepWorkout dayIndex={current} onBack={()=>setStepMode(false)} />
      )}
    </div>
  );
}
