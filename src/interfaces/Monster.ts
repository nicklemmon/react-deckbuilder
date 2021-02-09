export default interface Monster {
  id: string
  name: string
  level: number
  goldBounty: number
  artwork?: string
  damageTaken?: number

  sfx?: {
    intro?: string
    damage?: string
    death?: string
  }

  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }
}
