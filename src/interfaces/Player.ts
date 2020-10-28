export default interface Player {
  name: string
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
