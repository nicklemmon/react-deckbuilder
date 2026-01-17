import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import imageMin from 'vite-plugin-imagemin'
import { playwright } from '@vitest/browser-playwright'

const DEFAULT_PLUGINS: PluginOption = [
  react(),
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
  if (mode === 'production') {
    return {
      plugins: [...DEFAULT_PLUGINS, compression()],
    }
  }

  return {
    plugins: DEFAULT_PLUGINS,
    test: {
      environment: 'happy-dom',
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
