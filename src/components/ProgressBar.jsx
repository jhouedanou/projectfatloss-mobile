import React from 'react';
export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div style={{ width: '100%', background: '#eee', borderRadius: 8, height: 12, margin: '12px 0' }}>
      <div style={{ width: percent + '%', background: '#4a4e69', height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
    </div>
  );
}
