export default interface Monster {
  id: string
  name: string
  level: number
  artwork?: string
  damageTaken?: number

  stats: {
    hitPoints: number
    attack: number
    defense: number
  }
}
