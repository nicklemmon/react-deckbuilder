export default interface Monster {
  id: string
  name: string
  level: number
  artwork?: string
  stats: {
    hitPoints: number
    attack: number
    defense: number
  }
}
