import type { Item } from './items'

export const CHARACTER_CLASSES = ['berzerker', 'cleric', 'archer'] as const

type CharacterClass = (typeof CHARACTER_CLASSES)[number]

export interface Player {
  name?: string
  characterClass?: CharacterClass
  characterPortrait?: string
  damageTaken?: number
  healingAmount?: number
  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }
  inventory: {
    gold: number
    items: Array<Item> | []
  }
}
