import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compress from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'production' ? compress() : undefined].filter(Boolean),
}))
