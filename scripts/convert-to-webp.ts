import { readdir, stat, unlink } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import sharp from 'sharp'

type Options = {
  dryRun: boolean
  deleteOriginals: boolean
  overwrite: boolean
  quality: number
  exclude: string[]
  verbose: boolean
  help: boolean
}

const defaultExclusions = ['node_modules', 'dist', '.playwright-mcp', '.git', 'public']

const helpText = `
WebP Image Conversion Script

Usage: npm run convert:webp [options]

Options:
  --dry-run           Preview changes without converting
  --delete-originals  Remove source files after conversion
  --overwrite         Replace existing .webp files
  --quality <n>       WebP quality 1-100 (default: 80)
  --exclude <dir>     Additional directories to skip (can be used multiple times)
  -v, --verbose       Detailed output
  -h, --help          Show this help message

Default exclusions: ${defaultExclusions.join(', ')}

Examples:
  npm run convert:webp:dry              # Preview changes
  npm run convert:webp                  # Convert all images
  npm run convert:webp -- --quality 90  # Use higher quality
  npm run convert:webp -- --exclude public --verbose  # Skip public directory
`

function parseCliArgs(): Options {
  const { values } = parseArgs({
    options: {
      'dry-run': { type: 'boolean', default: false },
      'delete-originals': { type: 'boolean', default: false },
      overwrite: { type: 'boolean', default: false },
      quality: { type: 'string', default: '80' },
      exclude: { type: 'string', multiple: true, default: [] },
      verbose: { type: 'boolean', short: 'v', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
    allowPositionals: false,
  })

  return {
    dryRun: values['dry-run'],
    deleteOriginals: values['delete-originals'],
    overwrite: values.overwrite,
    quality: parseInt(values.quality, 10),
    exclude: values.exclude,
    verbose: values.verbose,
    help: values.help,
  }
}

async function* findImages(dir: string, exclusions: string[]): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (!exclusions.includes(entry.name)) {
        yield* findImages(fullPath, exclusions)
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        yield fullPath
      }
    }
  }
}

async function convertImage(
  sourcePath: string,
  options: Options,
): Promise<{ originalSize: number; webpSize: number } | null> {
  const dir = dirname(sourcePath)
  const ext = extname(sourcePath)
  const base = basename(sourcePath, ext)
  const webpPath = join(dir, `${base}.webp`)

  // Check if WebP already exists
  try {
    await stat(webpPath)
    if (!options.overwrite) {
      if (options.verbose) {
        console.log(`⏭️  Skipping ${sourcePath} (WebP already exists)`)
      }
      return null
    }
  } catch {
    // WebP doesn't exist, continue
  }

  if (options.dryRun) {
    if (options.verbose) {
      console.log(`🔍 Would convert: ${sourcePath} → ${webpPath}`)
    } else {
      process.stdout.write('.')
    }
    // Return placeholder sizes for dry-run summary
    const sourceStats = await stat(sourcePath)
    return { originalSize: sourceStats.size, webpSize: sourceStats.size }
  }

  try {
    const sourceStats = await stat(sourcePath)
    const originalSize = sourceStats.size

    await sharp(sourcePath).webp({ quality: options.quality }).toFile(webpPath)

    const webpStats = await stat(webpPath)
    const webpSize = webpStats.size

    if (options.deleteOriginals) {
      await unlink(sourcePath)
      if (options.verbose) {
        console.log(`🗑️  Deleted: ${sourcePath}`)
      }
    }

    if (options.verbose) {
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1)
      console.log(`✅ Converted: ${sourcePath} → ${webpPath} (${savings}% smaller)`)
    } else {
      process.stdout.write('.')
    }

    return { originalSize, webpSize }
  } catch (error) {
    console.error(`\n❌ Error converting ${sourcePath}:`, error)
    return null
  }
}

async function main() {
  const options = parseCliArgs()

  if (options.help) {
    console.log(helpText)
    process.exit(0)
  }

  if (options.quality < 1 || options.quality > 100) {
    console.error('❌ Quality must be between 1 and 100')
    process.exit(1)
  }

  const exclusions = [...defaultExclusions, ...options.exclude]
  const startDir = process.cwd()

  if (options.verbose) {
    console.log('🔍 Scanning for images...')
  }

  if (options.dryRun) {
    console.log('🏃 DRY RUN MODE - No files will be modified')
  }

  let totalOriginalSize = 0
  let totalWebpSize = 0
  let convertedCount = 0
  let skippedCount = 0
  let wroteProgress = false

  for await (const imagePath of findImages(startDir, exclusions)) {
    const result = await convertImage(imagePath, options)

    if (result) {
      totalOriginalSize += result.originalSize
      totalWebpSize += result.webpSize
      convertedCount++
      if (!options.verbose) wroteProgress = true
    } else if (!options.dryRun) {
      skippedCount++
    }
  }

  // Progress dots are written without newlines; finish the line only if we wrote any.
  if (wroteProgress) {
    process.stdout.write('\n')
  }

  const summaryParts = [`converted ${convertedCount}`]
  if (skippedCount > 0) {
    summaryParts.push(`skipped ${skippedCount} (already exist)`)
  }
  console.log(`📊 WebP: ${summaryParts.join(', ')}`)

  if (convertedCount > 0 && !options.dryRun) {
    const totalSavings = totalOriginalSize - totalWebpSize
    const savingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1)
    const savingsMB = (totalSavings / 1024 / 1024).toFixed(2)

    console.log(`   Size reduction: ${savingsMB}MB (${savingsPercent}% smaller)`)
  }

  if (options.dryRun) {
    console.log('💡 Run without --dry-run to perform actual conversion')
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
