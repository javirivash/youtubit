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
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
