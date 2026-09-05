import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { imagetools } from 'vite-imagetools'
import { webpConversion } from './vite-plugin-webp'

const DEFAULT_PLUGINS: PluginOption = [
  react(),
  webpConversion(), // Run WebP conversion before other image processing
  imagetools(),
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = mode === 'production' ? [...DEFAULT_PLUGINS, compression()] : DEFAULT_PLUGINS

  return {
    plugins,
  }
})
