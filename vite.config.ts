import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'

const DEFAULT_PLUGINS: PluginOption = [react(), imageOptimizer()]

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
