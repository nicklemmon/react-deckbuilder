import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import imageMin from 'vite-plugin-imagemin'

const DEFAULT_PLUGINS: PluginOption = [
  react(),
  imageMin({
    mozjpeg: { quality: 75 },
    pngquant: { quality: [0.65, 0.9] },
    webp: { quality: 75 },
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
  }
})
