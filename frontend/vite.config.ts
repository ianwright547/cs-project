import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': process.env.CODE_PRACTICE_API_URL || 'http://127.0.0.1:8000', '/auth': process.env.CODE_PRACTICE_API_URL || 'http://127.0.0.1:8000', '/health': process.env.CODE_PRACTICE_API_URL || 'http://127.0.0.1:8000' } },
  build: { rollupOptions: { input: ['index.html', 'dashboard.html', 'course.html', 'login.html', 'profile.html'] } },
});
