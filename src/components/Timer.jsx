import React, { useState, useRef } from 'react';

export default function Timer({ seconds }) {
  const [time, setTime] = useState(seconds);
  const [running, setRunning] = useState(false);
  const interval = useRef(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      interval.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(interval.current);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const reset = () => {
    clearInterval(interval.current);
    setTime(seconds);
    setRunning(false);
  };

  React.useEffect(() => () => clearInterval(interval.current), []);

  const min = String(Math.floor(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>{min}:{sec}</span>
      {!running ? (
        <button className="timer-btn" onClick={start}>Démarrer</button>
      ) : (
        <button className="timer-btn" onClick={reset}>Réinitialiser</button>
      )}
    </div>
  );
}
