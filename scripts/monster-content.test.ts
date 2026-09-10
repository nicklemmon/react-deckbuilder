import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import {
  composeArtworkPrompt,
  finalizedManifest,
  scaffold,
  slugify,
  validateDraft,
  validateDraftForScaffolding,
  type MonsterDraft,
} from './monster-content'

const validDraft: MonsterDraft = {
  status: 'approved',
  name: 'Mossback Troll',
  slug: 'mossback-troll',
  gameMode: 'standard',
  level: 4,
  concept: 'An old bridge troll covered in moss.',
  visualDescription: 'an old bridge troll covered in moss with amber eyes',
  poseAndAction: 'the troll braces a stone club while watching the road',
  setting: 'a misty ruined bridge at dawn',
  lightingAndPalette: 'cold blue ambient light with a warm amber rim light',
  stats: { maxHealth: 12, attack: 4, defense: 3, rationale: 'A durable mid-level foe.' },
  goldBounty: 5,
  artDirection: { referenceImage: 'src/monsters/haunting-spirit/artwork.png', prompt: 'set below' },
  artworkSource: '.monster-drafts/mossback-troll/artwork.png',
}

describe('monster content', () => {
  it('creates stable kebab-case slugs', () => {
    expect(slugify('  Cinnamon Swirl! ')).toBe('cinnamon-swirl')
  })

  it('rejects delegated and incomplete values', () => {
    const errors = validateDraft({
      ...validDraft,
      level: null,
      setting: 'decide for me',
    })
    expect(errors).toContain('level must be a positive integer')
    expect(errors).toContain('setting must contain an approved value')
  })

  it('keeps runtime gameplay fields out of the finalized manifest', () => {
    const manifest = finalizedManifest(validDraft)

    expect(manifest.statRationale).toBe(validDraft.stats.rationale)
    expect(manifest).not.toHaveProperty('name')
    expect(manifest).not.toHaveProperty('gameMode')
    expect(manifest).not.toHaveProperty('level')
    expect(manifest).not.toHaveProperty('stats')
    expect(manifest).not.toHaveProperty('goldBounty')
    expect(manifest).not.toHaveProperty('artworkSource')
  })

  it('rejects a prompt that no longer matches the creative fields', async () => {
    const errors = await validateDraftForScaffolding(validDraft)

    expect(errors).toContain('artDirection.prompt does not match the current creative fields')
  })

  it('accepts a prompt rendered from the current creative fields', async () => {
    const prompt = await composeArtworkPrompt(validDraft)
    const errors = await validateDraftForScaffolding({
      ...validDraft,
      artDirection: { ...validDraft.artDirection, prompt },
    })

    expect(errors).toEqual([])
  })

  it('rejects unresolved optional audio direction', () => {
    const errors = validateDraft({
      ...validDraft,
      audioDirection: { intro: 'decide for me', damage: 'a low groan', death: 'a heavy fall' },
    })

    expect(errors).toContain('audioDirection.intro must contain an approved value')
  })

  it('completes a partial scaffold without overwriting an existing file', async () => {
    const root = await mkdtemp(join(tmpdir(), 'monster-content-'))
    try {
      const promptsDir = join(root, 'prompts', 'monster-art')
      const artworkDir = join(root, '.monster-drafts', 'mossback-troll')
      await mkdir(promptsDir, { recursive: true })
      await mkdir(artworkDir, { recursive: true })
      await writeFile(
        join(promptsDir, 'standard.md'),
        await readFile(join(process.cwd(), 'prompts', 'monster-art', 'standard.md')),
      )
      await sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 4,
          background: '#14281e',
        },
      })
        .png()
        .toFile(join(artworkDir, 'artwork.png'))

      const draft = {
        ...validDraft,
        artworkSource: '.monster-drafts/mossback-troll/artwork.png',
      }
      draft.artDirection = {
        ...draft.artDirection,
        prompt: await composeArtworkPrompt(draft, root),
      }
      const draftPath = join(root, 'draft.json')
      await writeFile(draftPath, JSON.stringify(draft))

      await scaffold(draftPath, root)
      const targetDir = join(root, 'src', 'monsters', draft.slug)
      const originalConfig = await readFile(join(targetDir, 'config.ts'), 'utf8')
      await rm(join(targetDir, 'manifest.json'))
      await rm(join(targetDir, 'artwork.webp'))

      await scaffold(draftPath, root)

      expect(await readFile(join(targetDir, 'config.ts'), 'utf8')).toBe(originalConfig)
      expect(JSON.parse(await readFile(join(targetDir, 'manifest.json'), 'utf8'))).toMatchObject({
        slug: draft.slug,
      })
      await expect(readFile(join(targetDir, 'artwork.webp'))).resolves.toBeDefined()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
