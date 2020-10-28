export default interface Monster {
  id: string
  name: string
  level: number
  artwork?: string
  damageTaken?: number

  stats: {
    health: number
    attack: number
    defense: number
  }
}
