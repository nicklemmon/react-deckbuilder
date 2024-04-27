import type { Card, Deck } from '../types'

/** Defines a card config. */
export function defineCard(config: Omit<Card, 'id' | 'artwork' | 'sfx'>) {
  return config
}

/** Returns a card from a deck by its id */
export function getCard(id: string, deck: Deck) {
  return [...deck].find((card) => card.id === id)
}
