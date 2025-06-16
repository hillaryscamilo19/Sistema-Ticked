import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Acepta conexiones desde cualquier IP
    port: 5173,       // o el puerto que prefieras
  },
});
