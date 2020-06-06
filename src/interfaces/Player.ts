export default interface Player {
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
