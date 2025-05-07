import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/projectfatloss/', // Updated base URL for GitHub Pages
});
