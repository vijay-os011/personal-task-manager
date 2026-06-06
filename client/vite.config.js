import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // If we are building for production, use the GitHub Pages path.
    // If we are running locally (dev), use the root '/' path.
    base: command === 'build' ? '/personal-task-manager/' : '/',
  };
});