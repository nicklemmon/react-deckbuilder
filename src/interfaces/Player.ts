enum CharacterClass {
  Berzerker = 'berzerker',
  Cleric = 'cleric',
  Archer = 'archer',
}

export default interface Player {
  name?: string
  characterClass?: CharacterClass
  level: number
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
