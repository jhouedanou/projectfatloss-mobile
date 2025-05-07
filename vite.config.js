import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/semaine-muscu-mobile/', // Ajout de la base URL pour GitHub Pages
});
