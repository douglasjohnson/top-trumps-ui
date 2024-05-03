import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/vite-react-ts/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
    coverage: {
      include: ['src/*.ts{x,}'],
      exclude: ['src/main.tsx'],
      thresholds: {
        100: true,
      },
      reporter: ['text', 'html', 'json-summary', 'json'],
    },
  },
  server: {
    proxy: {
      '/decks': 'http://localhost:8080',
    },
  },
});
