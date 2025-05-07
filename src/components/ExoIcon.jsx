import React from 'react';

const icons = {
  dumbbell: '💪',
  'arrow-up': '⬆️',
  'arm-flex': '💪',
  bars: '🏋️',
  abs: '🧘',
  plank: '🧘',
  rowing: '🚣',
  shrug: '🤷',
  mountain: '🏔️',
  twist: '🔄',
  squat: '🦵',
  lunge: '🚶',
  deadlift: '🏋️',
  'step-up': '🪜',
  'hip-thrust': '🍑',
  calf: '🦶',
  'leg-raise': '🦵',
  pushup: '🤸',
  'good-morning': '🌅',
  'reverse-fly': '🕊️',
  bike: '🚴',
  cardio: '❤️',
  stretch: '🤸',
  mobility: '🦾',
  'hip-extension': '🦵',
  // Nouveaux pour équipement
  dumbbell_equip: '🏋️‍♂️',
  barbell: '🏋️‍♀️',
  vest: '🎽',
  bench: '🛋️',
  ankle: '🦶',
  none: '❌',
};

export function EquipIcon({ equip, size = 20 }) {
  let icon = null;
  if (/haltère/i.test(equip)) icon = icons.dumbbell_equip;
  else if (/barre/i.test(equip)) icon = icons.barbell;
  else if (/gilet/i.test(equip)) icon = icons.vest;
  else if (/banc|canapé/i.test(equip)) icon = icons.bench;
  else if (/cheville/i.test(equip)) icon = icons.ankle;
  else if (/aucun|optionnel/i.test(equip)) icon = icons.none;
  return icon ? <span style={{ fontSize: size, marginRight: 4 }}>{icon}</span> : null;
}

export default function ExoIcon({ type, size = 32 }) {
  return (
    <span style={{ fontSize: size }}>{icons[type] || '🏋️'}</span>
  );
}
