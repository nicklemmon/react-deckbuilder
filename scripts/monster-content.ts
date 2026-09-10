import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import sharp from 'sharp'
import { z } from 'zod'

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

/** Turns a display name into a stable kebab-case slug. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const approvedText = z
  .string({ error: 'must contain an approved value' })
  .trim()
  .min(1, { error: 'must contain an approved value' })
  .refine((value) => value.toLowerCase() !== 'decide for me', {
    error: 'must contain an approved value',
  })

const positiveInteger = z
  .number({ error: 'must be a positive integer' })
  .int({ error: 'must be a positive integer' })
  .positive({ error: 'must be a positive integer' })

const nonNegativeInteger = z
  .number({ error: 'must be a non-negative integer' })
  .int({ error: 'must be a non-negative integer' })
  .nonnegative({ error: 'must be a non-negative integer' })

const monsterDraftSchema = z.object({
  status: z.enum(['draft', 'approved'], { error: 'is invalid' }),
  name: approvedText,
  slug: z
    .string({ error: 'must be lowercase kebab-case' })
    .min(1, { error: 'must be lowercase kebab-case' })
    .refine((value) => value === slugify(value), { error: 'must be lowercase kebab-case' }),
  gameMode: z.enum(MODES, { error: 'must be standard or rainbow' }),
  level: positiveInteger,
  concept: approvedText,
  visualDescription: approvedText,
  poseAndAction: approvedText,
  setting: approvedText,
  lightingAndPalette: approvedText,
  stats: z.object({
    maxHealth: positiveInteger,
    attack: positiveInteger,
    defense: nonNegativeInteger,
    rationale: approvedText,
  }),
  goldBounty: positiveInteger,
  artDirection: z.object({
    referenceImage: approvedText,
    prompt: approvedText,
  }),
  artworkSource: approvedText,
  audioDirection: z
    .object({
      intro: approvedText,
      damage: approvedText,
      death: approvedText,
    })
    .optional(),
})

/** Formats Zod issues as field-prefixed failure messages. */
function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.')
    return path ? `${path} ${issue.message}` : issue.message
  })
}

/** Returns failures that must be resolved before a draft can be scaffolded. */
export function validateDraft(draft: MonsterDraft): string[] {
  const result = monsterDraftSchema.safeParse(draft)
  return result.success ? [] : formatZodErrors(result.error)
}

/** Reads the mode prompt template and its style-reference path. */
async function readPrompt(mode: GameMode, root = ROOT) {
  const source = await readFile(join(root, 'prompts', 'monster-art', `${mode}.md`), 'utf8')
  const match = source.match(/^---\nreference-image:\s*(.+)\n---\n+([\s\S]+)$/)
  if (!match?.[1] || !match[2]) throw new Error(`Invalid ${mode} prompt frontmatter`)
  return { referenceImage: match[1].trim(), template: match[2].trim() }
}

/** Builds the exact image prompt from approved creative fields. */
export async function composeArtworkPrompt(draft: MonsterDraft, root = ROOT): Promise<string> {
  const { template } = await readPrompt(draft.gameMode, root)
  const replacements: Record<string, string> = {
    visualDescription: draft.visualDescription,
    poseAndAction: draft.poseAndAction,
    setting: draft.setting,
    lightingAndPalette: draft.lightingAndPalette,
  }
  return template.replace(/{{(\w+)}}/g, (_, key: string) => replacements[key] ?? `{{${key}}}`)
}

/** Validates that the approved artwork prompt still matches the current creative fields. */
export async function validateDraftForScaffolding(draft: MonsterDraft, root = ROOT) {
  const errors = validateDraft(draft)
  if (errors.length) return errors

  const { referenceImage } = await readPrompt(draft.gameMode, root)
  const expectedPrompt = await composeArtworkPrompt(draft, root)
  if (draft.artDirection.referenceImage !== referenceImage) {
    errors.push('artDirection.referenceImage does not match the mode template')
  }
  if (draft.artDirection.prompt !== expectedPrompt) {
    errors.push('artDirection.prompt does not match the current creative fields')
  }
  return errors
}

/** Asks one interactive question and returns the answer or fallback. */
async function ask(question: string, fallback = ''): Promise<string> {
  const rl = createInterface({ input, output })
  try {
    const suffix = fallback ? ` [${fallback}]` : ''
    return (await rl.question(`${question}${suffix}: `)).trim() || fallback
  } finally {
    rl.close()
  }
}

/** Builds a draft from seeded answers and optional interactive prompts. */
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

/** Loads a draft JSON file from disk. */
async function loadDraft(path: string): Promise<MonsterDraft> {
  return JSON.parse(await readFile(resolve(path), 'utf8')) as MonsterDraft
}

/** Confirms artwork is a 1024×1024 PNG before scaffolding. */
async function validateArtwork(path: string) {
  const metadata = await sharp(path).metadata()
  if (metadata.format !== 'png') throw new Error('Artwork must be a PNG')
  if (metadata.width !== 1024 || metadata.height !== 1024) {
    throw new Error(
      `Artwork must be exactly 1024x1024; received ${metadata.width}x${metadata.height}`,
    )
  }
}

/** Writes a file only when missing, or when existing bytes already match. */
async function writeFileIfMissing(path: string, content: string | Uint8Array) {
  try {
    await writeFile(path, content, { flag: 'wx' })
    return
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
  }

  const existing = await readFile(path)
  const expected = typeof content === 'string' ? Buffer.from(content) : Buffer.from(content)
  if (!existing.equals(expected)) throw new Error(`Refusing to overwrite differing file: ${path}`)
}

/** Renders the monster config.ts source from approved runtime fields. */
function configSource(draft: MonsterDraft): string {
  return `import { defineMonster } from '../../helpers/monsters'\n\nexport default defineMonster({\n  name: ${JSON.stringify(draft.name)},\n  level: ${draft.level},\n  goldBounty: ${draft.goldBounty},\n  gameMode: ${JSON.stringify(draft.gameMode)},\n  stats: {\n    maxHealth: ${draft.stats.maxHealth},\n    health: ${draft.stats.maxHealth},\n    attack: ${draft.stats.attack},\n    defense: ${draft.stats.defense},\n  },\n})\n`
}

/** Builds creative provenance without duplicating runtime fields owned by config.ts. */
export function finalizedManifest(draft: MonsterDraft) {
  return {
    status: draft.status,
    slug: draft.slug,
    concept: draft.concept,
    visualDescription: draft.visualDescription,
    poseAndAction: draft.poseAndAction,
    setting: draft.setting,
    lightingAndPalette: draft.lightingAndPalette,
    statRationale: draft.stats.rationale,
    artDirection: draft.artDirection,
    ...(draft.audioDirection ? { audioDirection: draft.audioDirection } : {}),
  }
}

/** Creates missing monster files from an approved draft without overwriting diffs. */
export async function scaffold(draftPath: string, root = ROOT) {
  const draft = await loadDraft(draftPath)
  const errors = await validateDraftForScaffolding(draft, root)
  if (errors.length) throw new Error(errors.join('\n'))
  if (draft.status !== 'approved')
    throw new Error('Draft status must be approved before scaffolding')

  const expectedPrompt = await composeArtworkPrompt(draft, root)
  const { referenceImage } = await readPrompt(draft.gameMode, root)

  const targetDir = join(root, 'src', 'monsters', draft.slug)
  const configPath = join(targetDir, 'config.ts')
  const manifestPath = join(targetDir, 'manifest.json')
  const pngPath = join(targetDir, 'artwork.png')
  const webpPath = join(targetDir, 'artwork.webp')
  const sourceArtwork = resolve(root, draft.artworkSource)
  const artworkForScaffold = existsSync(pngPath) ? pngPath : sourceArtwork
  await validateArtwork(artworkForScaffold)

  await mkdir(targetDir, { recursive: true })
  await writeFileIfMissing(pngPath, await readFile(sourceArtwork))
  await writeFileIfMissing(configPath, configSource(draft))
  const finalizedDraft = {
    ...draft,
    artDirection: { referenceImage, prompt: expectedPrompt },
  }
  await writeFileIfMissing(
    manifestPath,
    `${JSON.stringify(finalizedManifest(finalizedDraft), null, 2)}\n`,
  )
  if (!existsSync(webpPath)) {
    const webp = await sharp(pngPath).webp({ quality: 80 }).toBuffer()
    await writeFile(webpPath, webp, { flag: 'wx' })
  }
  console.log(`Created monster files in ${targetDir}`)
}

/** Runs the monster draft, prompt, validate, or scaffold CLI command. */
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
    const prompt = await composeArtworkPrompt(draft)
    const promptChanged =
      draft.artDirection.referenceImage !== referenceImage || draft.artDirection.prompt !== prompt
    if (promptChanged) {
      const updatedDraft = {
        ...draft,
        status: 'draft' as const,
        artDirection: { referenceImage, prompt },
      }
      await writeFile(resolve(path), `${JSON.stringify(updatedDraft, null, 2)}\n`)
      console.log('Draft prompt updated; approval status reset to draft.\n')
    }
    console.log(`Reference image: ${referenceImage}\n\n${prompt}`)
    return
  }
  if (command === 'validate') {
    const draft = await loadDraft(path)
    const errors = await validateDraftForScaffolding(draft)
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
