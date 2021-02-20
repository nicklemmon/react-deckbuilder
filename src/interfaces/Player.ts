export enum CharacterClass {
  Berzerker = 'berzerker',
  Cleric = 'cleric',
  Archer = 'archer',
}

export interface Player {
  name?: string
  characterClass?: CharacterClass
  artwork?: string
  damageTaken?: number

  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }

  inventory: {
    gold: number
  }
}
