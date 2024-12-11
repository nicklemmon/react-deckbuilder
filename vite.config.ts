import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import injectPreload from 'unplugin-inject-preload/vite'
import compress from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    injectPreload({
      injectTo: 'head',
      files: [
        {
          entryMatch: /.*\.(png|svg)$/,
          outputMatch: /.*\.(png|svg)$/,
        },
      ],
    }),
    ...(mode === 'production' ? [compress()] : []),
  ],
}))
