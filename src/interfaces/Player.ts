import { Item } from 'src/interfaces'

export enum CharacterClass {
  Berzerker = 'berzerker',
  Cleric = 'cleric',
  Archer = 'archer',
}

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
