import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: ['tests/unit/**/*.{test,spec}.ts', 'tests/**/*.unit.{test,spec}.ts'],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          // an example of file based convention,
          // you don't have to follow it
          include: ['tests/**/*.{test,spec}.tsx', 'tests/**/*.{test,spec}.tsx'],
          name: 'browser',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
