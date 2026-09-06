import { describe, expect, it } from 'vitest'
import { slugify, validateDraft, type MonsterDraft } from './monster-content'

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
})
