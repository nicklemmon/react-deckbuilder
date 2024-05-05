import type { Card, Deck } from '../types/cards'
import { getSound } from './get-sound'

/** Defines a card config. */
export function defineCard(config: Omit<Card, 'id' | 'artwork' | 'sfx'>) {
  return config
}

/** Returns a card from a deck by its id */
export function getCard(id: string, deck: Deck) {
  return [...deck].find((card) => card.id === id)
}

const CARD_CONFIG_MODULES = import.meta.glob('../cards/**/config.ts', {
  eager: true,
  import: 'default',
})

const CARD_SFX_MODULES = import.meta.glob('../cards/**/*.wav', { eager: true, import: 'default' })

const CARD_ARTWORK_MODULES = import.meta.glob('../cards/**/*.png', {
  eager: true,
  import: 'default',
})

/** Array of available cards derived from `src/cards` file contents */
export const CARDS = Object.entries(CARD_CONFIG_MODULES).map(([path, mod]) => {
  const dir = path.replace('/config.ts', '')
  const id = dir.replace('../cards/', '')

  return {
    ...(mod as Card),
    id,
    artwork: CARD_ARTWORK_MODULES[`${dir}/artwork.png`],
    sfx: getSound({ src: CARD_SFX_MODULES[`${dir}/sfx.wav`] as string }),
  }
}) as Array<Card>
