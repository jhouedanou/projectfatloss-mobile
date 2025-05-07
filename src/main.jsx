import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';
import './index.css';
import './i18n'; // Importation du système de traduction

createRoot(document.getElementById('root')).render(<App />);
