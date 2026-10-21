import { defineConfig } from 'vitest/config'

// Separate test config keeps Vitest's bundled Vite isolated from
// the project's Vite 8 + Rolldown setup to avoid type conflicts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
