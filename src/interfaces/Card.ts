import { Howl } from 'howler'

export type CardOverlayVariant = 'none' | 'purchased' | 'destroyed'

export interface Card {
  id: string
  name: string
  artwork?: string
  sfx: Howl
  rarity: 0 | 1 | 2 | 3
  description: string
  price: number
  isPurchased?: boolean
  isDisabled?: boolean
  overlayVariant?: CardOverlayVariant | undefined
  stats: {
    attack: number
  }
}
