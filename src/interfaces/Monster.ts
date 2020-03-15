export default interface Monster {
  id: string
  name: string
  level: number
  stats: {
    hitPoints: number
    attack: number
    defense: number
  }
}
