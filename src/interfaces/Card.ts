import { Howl } from 'howler'

export enum CardStatus {
  'face-down',
  'face-up',
  'purchased',
  'disabled',
}

export interface Card {
  id: string
  name: string
  artwork?: string
  sfx: Howl
  rarity: 0 | 1 | 2 | 3
  description: string
  price: number
  status?: CardStatus | undefined
  stats: {
    attack: number
  }
}
