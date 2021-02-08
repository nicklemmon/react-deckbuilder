export default interface Monster {
  id: string
  name: string
  level: number
  goldBounty: number
  artwork?: string
  damageTaken?: number

  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }
}
