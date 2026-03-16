/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Makes vi, describe, it, expect available globally
    environment: 'jsdom', // Simulates browser environment
    setupFiles: './src/setupTests.js', // Optional: for global test setup
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 60,
        branches: 55,
        functions: 60,
        lines: 60,
      },
    },
  },
});
