import { Howl } from 'howler'

export type Card = {
  id: string
  name: string
  sfx: Howl
  rarity: 0 | 1 | 2 | 3
  description: string
  price: number
  stats: {
    attack: number
  }
  artwork?: string
  status?: 'face-down' | 'face-up' | 'purchased' | 'disabled'
}

export type Deck = Array<Card> | []
