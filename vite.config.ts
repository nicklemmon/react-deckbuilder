import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import imageMin from 'vite-plugin-imagemin'
import { imagetools } from 'vite-imagetools'
import { playwright } from '@vitest/browser-playwright'

const DEFAULT_PLUGINS: PluginOption = [
  react(),
  imagetools(),
  imageMin({
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
  }),
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = mode === 'production' ? [...DEFAULT_PLUGINS, compression()] : DEFAULT_PLUGINS

  return {
    plugins,
    test: {
      setupFiles: ['./src/test-setup.ts'],
      browser: {
        enabled: true,
        instances: [
          {
            browser: 'chromium',
          },
        ],
        provider: playwright(),
        headless: true,
      },
    },
  }
})
