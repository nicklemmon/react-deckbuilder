export default interface Card {
  id: string
  name: string
  artwork?: string
  rarity: 0 | 1 | 2 | 3
  description: string
  price: number
  isPurchased?: boolean
  isDisabled?: boolean
  overlayVariant?: 'none' | 'purchased' | 'destroyed'
  stats: {
    attack?: number
    defense?: number
  }
}
