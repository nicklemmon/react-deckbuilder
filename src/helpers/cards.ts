import type { Card } from '../types/cards'
import { getSound } from './get-sound'

/** Defines a card config. */
export function defineCard(config: Omit<Card, 'id' | 'artwork' | 'sfx'>) {
  return config
}

/** Returns a card from a deck by its id */
export function getCard(id: string, deck: readonly Card[]): Card | undefined {
  return deck.find((card) => card.id === id)
}

export function requireCard(id: string, deck: readonly Card[]): Card {
  const card = getCard(id, deck)
  if (!card) throw new Error(`Unknown card: ${id}`)
  return card
}

function requireAsset(assets: Record<string, string | undefined>, path: string): string {
  const asset = assets[path]
  if (!asset) throw new Error(`Missing required asset: ${path}`)
  return asset
}

const CARD_CONFIG_MODULES = import.meta.glob<Omit<Card, 'id' | 'artwork' | 'sfx'>>(
  '../cards/**/config.ts',
  {
    eager: true,
    import: 'default',
  },
)

const CARD_SFX_MODULES = import.meta.glob<string>('../cards/**/*.wav', {
  eager: true,
  import: 'default',
})

const CARD_ARTWORK_MODULES = import.meta.glob<string>('../cards/**/*.webp', {
  eager: true,
  import: 'default',
  query: { format: 'webp' },
})

/** Array of available cards derived from `src/cards` file contents */
export const CARDS = Object.entries(CARD_CONFIG_MODULES).map(([path, mod]) => {
  const dir = path.replace('/config.ts', '')
  const id = dir.replace('../cards/', '')

  return {
    ...mod,
    id,
    artwork: requireAsset(CARD_ARTWORK_MODULES, `${dir}/artwork.webp`),
    sfx: getSound({ src: requireAsset(CARD_SFX_MODULES, `${dir}/sfx.wav`) }),
  }
}) satisfies Card[]

/** Default starting deck - TODO: Build starting decks per character class */
export const STARTING_DECK = [
  requireCard('earthquake', CARDS),
  requireCard('strike', CARDS),
  requireCard('strike', CARDS),
  requireCard('strike', CARDS),
  requireCard('firebolt', CARDS),
  requireCard('firebolt', CARDS),
]
