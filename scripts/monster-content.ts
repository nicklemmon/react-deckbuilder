import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import sharp from 'sharp'

export type GameMode = 'standard' | 'rainbow'

export type MonsterDraft = {
  status: 'draft' | 'approved'
  name: string
  slug: string
  gameMode: GameMode
  level: number | null
  concept: string
  visualDescription: string
  poseAndAction: string
  setting: string
  lightingAndPalette: string
  stats: {
    maxHealth: number | null
    attack: number | null
    defense: number | null
    rationale: string
  }
  goldBounty: number | null
  artDirection: {
    referenceImage: string
    prompt: string
  }
  artworkSource: string
  audioDirection?: {
    intro: string
    damage: string
    death: string
  }
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DRAFTS_DIR = join(ROOT, '.monster-drafts')
const MODES = ['standard', 'rainbow'] as const

const helpText = `
Monster content workflow

Usage:
  npm run monster -- draft [--input answers.json]
  npm run monster -- prompt <draft.json>
  npm run monster -- validate <draft.json>
  npm run monster -- scaffold <draft.json>

The draft command writes ignored working state. Validate is read-only. Scaffold requires an approved
draft and creates only missing files in src/monsters/<slug>.
`

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0
}

function requireText(value: unknown, field: string, errors: string[]) {
  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    value.trim().toLowerCase() === 'decide for me'
  ) {
    errors.push(`${field} must contain an approved value`)
  }
}

/** Returns failures that must be resolved before a draft can be scaffolded. */
export function validateDraft(draft: MonsterDraft): string[] {
  const errors: string[] = []
  if (draft.status !== 'draft' && draft.status !== 'approved') errors.push('status is invalid')
  requireText(draft.name, 'name', errors)
  if (!draft.slug || draft.slug !== slugify(draft.slug))
    errors.push('slug must be lowercase kebab-case')
  if (!MODES.includes(draft.gameMode)) errors.push('gameMode must be standard or rainbow')
  if (!isPositiveInteger(draft.level)) errors.push('level must be a positive integer')
  requireText(draft.concept, 'concept', errors)
  requireText(draft.visualDescription, 'visualDescription', errors)
  requireText(draft.poseAndAction, 'poseAndAction', errors)
  requireText(draft.setting, 'setting', errors)
  requireText(draft.lightingAndPalette, 'lightingAndPalette', errors)
  if (!isPositiveInteger(draft.stats.maxHealth))
    errors.push('stats.maxHealth must be a positive integer')
  if (!isPositiveInteger(draft.stats.attack)) errors.push('stats.attack must be a positive integer')
  if (!Number.isInteger(draft.stats.defense) || Number(draft.stats.defense) < 0) {
    errors.push('stats.defense must be a non-negative integer')
  }
  requireText(draft.stats.rationale, 'stats.rationale', errors)
  if (!isPositiveInteger(draft.goldBounty)) errors.push('goldBounty must be a positive integer')
  requireText(draft.artworkSource, 'artworkSource', errors)
  return errors
}

async function readPrompt(mode: GameMode) {
  const source = await readFile(join(ROOT, 'prompts', 'monster-art', `${mode}.md`), 'utf8')
  const match = source.match(/^---\nreference-image:\s*(.+)\n---\n+([\s\S]+)$/)
  if (!match?.[1] || !match[2]) throw new Error(`Invalid ${mode} prompt frontmatter`)
  return { referenceImage: match[1].trim(), template: match[2].trim() }
}

/** Builds the exact image prompt from approved creative fields. */
export async function composeArtworkPrompt(draft: MonsterDraft): Promise<string> {
  const { template } = await readPrompt(draft.gameMode)
  const replacements: Record<string, string> = {
    visualDescription: draft.visualDescription,
    poseAndAction: draft.poseAndAction,
    setting: draft.setting,
    lightingAndPalette: draft.lightingAndPalette,
  }
  return template.replace(/{{(\w+)}}/g, (_, key: string) => replacements[key] ?? `{{${key}}}`)
}

async function ask(question: string, fallback = ''): Promise<string> {
  const rl = createInterface({ input, output })
  try {
    const suffix = fallback ? ` [${fallback}]` : ''
    return (await rl.question(`${question}${suffix}: `)).trim() || fallback
  } finally {
    rl.close()
  }
}

async function createDraftFromAnswers(
  seed: Partial<MonsterDraft> = {},
  interactive = true,
): Promise<MonsterDraft> {
  const answer = async (value: string | undefined, question: string, fallback = '') =>
    value ?? (interactive ? await ask(question, fallback) : fallback)
  const name = await answer(seed.name, 'Monster name or concept')
  const modeAnswer = await answer(seed.gameMode, 'Game mode (standard/rainbow)', 'standard')
  if (!MODES.includes(modeAnswer as GameMode))
    throw new Error('Game mode must be standard or rainbow')
  const gameMode = modeAnswer as GameMode
  const prompt = await readPrompt(gameMode)
  const levelAnswer = await answer(seed.level?.toString(), 'Level (blank lets the LLM recommend)')
  const concept = await answer(seed.concept, 'Core concept', name || 'decide for me')
  const visualDescription = await answer(
    seed.visualDescription,
    'Appearance and signature features',
    'decide for me',
  )
  const poseAndAction = await answer(seed.poseAndAction, 'Pose or action', 'decide for me')
  const setting = await answer(seed.setting, 'Setting', 'decide for me')
  const modeQuestion =
    gameMode === 'standard'
      ? 'Materials, lighting, and restrained palette'
      : 'Personality, magical details, lighting, and playful palette'
  const lightingAndPalette = await answer(seed.lightingAndPalette, modeQuestion, 'decide for me')
  const includeAudio = seed.audioDirection
    ? 'yes'
    : interactive
      ? await ask('Include future audio direction? (yes/no)', 'no')
      : 'no'

  const draft: MonsterDraft = {
    status: 'draft',
    name,
    slug: seed.slug ?? slugify(name),
    gameMode,
    level: levelAnswer ? Number(levelAnswer) : null,
    concept,
    visualDescription,
    poseAndAction,
    setting,
    lightingAndPalette,
    stats: seed.stats ?? { maxHealth: null, attack: null, defense: null, rationale: '' },
    goldBounty: seed.goldBounty ?? null,
    artDirection: {
      referenceImage: prompt.referenceImage,
      prompt: '',
    },
    artworkSource: seed.artworkSource ?? '',
    ...(includeAudio.toLowerCase().startsWith('y')
      ? {
          audioDirection: seed.audioDirection ?? {
            intro: 'decide for me',
            damage: 'decide for me',
            death: 'decide for me',
          },
        }
      : {}),
  }
  draft.artDirection.prompt = await composeArtworkPrompt(draft)
  return draft
}

async function loadDraft(path: string): Promise<MonsterDraft> {
  return JSON.parse(await readFile(resolve(path), 'utf8')) as MonsterDraft
}

async function validateArtwork(path: string) {
  const metadata = await sharp(path).metadata()
  if (metadata.format !== 'png') throw new Error('Artwork must be a PNG')
  if (metadata.width !== 1024 || metadata.height !== 1024) {
    throw new Error(
      `Artwork must be exactly 1024x1024; received ${metadata.width}x${metadata.height}`,
    )
  }
}

function configSource(draft: MonsterDraft): string {
  return `import { defineMonster } from '../../helpers/monsters'\n\nexport default defineMonster({\n  name: ${JSON.stringify(draft.name)},\n  level: ${draft.level},\n  goldBounty: ${draft.goldBounty},\n  gameMode: ${JSON.stringify(draft.gameMode)},\n  stats: {\n    maxHealth: ${draft.stats.maxHealth},\n    health: ${draft.stats.maxHealth},\n    attack: ${draft.stats.attack},\n    defense: ${draft.stats.defense},\n  },\n})\n`
}

function finalizedManifest(draft: MonsterDraft) {
  const { artworkSource: _artworkSource, ...manifest } = draft
  return manifest
}

async function scaffold(draftPath: string) {
  const draft = await loadDraft(draftPath)
  const errors = validateDraft(draft)
  if (errors.length) throw new Error(errors.join('\n'))
  if (draft.status !== 'approved')
    throw new Error('Draft status must be approved before scaffolding')

  const expectedPrompt = await composeArtworkPrompt(draft)
  const { referenceImage } = await readPrompt(draft.gameMode)

  const targetDir = join(ROOT, 'src', 'monsters', draft.slug)
  const configPath = join(targetDir, 'config.ts')
  const manifestPath = join(targetDir, 'manifest.json')
  const pngPath = join(targetDir, 'artwork.png')
  const webpPath = join(targetDir, 'artwork.webp')
  if (existsSync(configPath) || existsSync(manifestPath)) {
    throw new Error(`Refusing to overwrite config.ts or manifest.json in ${targetDir}`)
  }

  const sourceArtwork = resolve(ROOT, draft.artworkSource)
  const artworkAlreadyInPlace = sourceArtwork === pngPath && existsSync(pngPath)
  if (existsSync(pngPath) && !artworkAlreadyInPlace) {
    throw new Error(`Refusing to overwrite ${pngPath}`)
  }
  if (existsSync(webpPath) && !artworkAlreadyInPlace) {
    throw new Error(`Refusing to overwrite ${webpPath}`)
  }
  await validateArtwork(sourceArtwork)

  await mkdir(targetDir, { recursive: true })
  if (!artworkAlreadyInPlace) await copyFile(sourceArtwork, pngPath)
  await writeFile(configPath, configSource(draft))
  const finalizedDraft = {
    ...draft,
    artDirection: { referenceImage, prompt: expectedPrompt },
  }
  await writeFile(manifestPath, `${JSON.stringify(finalizedManifest(finalizedDraft), null, 2)}\n`)
  if (!existsSync(webpPath)) await sharp(pngPath).webp({ quality: 80 }).toFile(webpPath)
  console.log(`Created monster files in ${targetDir}`)
}

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      input: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  })
  if (values.help || !positionals[0]) {
    console.log(helpText)
    return
  }

  const command = positionals[0]
  if (command === 'draft') {
    const seed = values.input
      ? (JSON.parse(await readFile(resolve(values.input), 'utf8')) as Partial<MonsterDraft>)
      : {}
    const draft = await createDraftFromAnswers(seed, !values.input)
    await mkdir(DRAFTS_DIR, { recursive: true })
    const path = join(DRAFTS_DIR, `${draft.slug || 'unnamed-monster'}.json`)
    if (existsSync(path)) throw new Error(`Refusing to overwrite ${path}`)
    await writeFile(path, `${JSON.stringify(draft, null, 2)}\n`)
    console.log(`Draft created: ${path}`)
    return
  }

  const path = positionals[1]
  if (!path) throw new Error(`${command} requires a draft path`)
  if (command === 'prompt') {
    const draft = await loadDraft(path)
    const { referenceImage } = await readPrompt(draft.gameMode)
    console.log(`Reference image: ${referenceImage}\n\n${await composeArtworkPrompt(draft)}`)
    return
  }
  if (command === 'validate') {
    const draft = await loadDraft(path)
    const errors = validateDraft(draft)
    if (errors.length) throw new Error(errors.join('\n'))
    await validateArtwork(resolve(ROOT, draft.artworkSource))
    console.log('Draft and artwork are valid')
    return
  }
  if (command === 'scaffold') {
    await scaffold(path)
    return
  }
  throw new Error(`Unknown command: ${command}`)
}

const isEntrypoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntrypoint) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
