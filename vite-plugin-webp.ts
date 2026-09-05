import { type Plugin } from 'vite'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export function webpConversion(): Plugin {
  let hasRun = false

  return {
    name: 'vite-plugin-webp-conversion',

    async buildStart() {
      // Only run once per Vite instance
      if (hasRun) return
      hasRun = true

      console.log('🖼️  Converting images to WebP...')

      try {
        const { stdout } = await execAsync(
          'node --experimental-strip-types scripts/convert-to-webp.ts',
        )
        const output = stdout.trim()
        if (output) console.log(output)
      } catch (error) {
        console.error('❌ WebP conversion failed:', error)
        // Don't fail the build, just warn
      }
    },
  }
}
