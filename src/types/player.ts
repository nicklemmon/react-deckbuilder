import type { Item } from './items'

export interface Player {
  name?: string
  characterClass?: string
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
