export default interface Card {
  id: string
  name: string
  artwork?: string
  rarity: 0 | 1 | 2 | 3
  description: string
  price?: number
  isDisabled?: boolean
  stats: {
    attack?: number
    defense?: number
  }
}
