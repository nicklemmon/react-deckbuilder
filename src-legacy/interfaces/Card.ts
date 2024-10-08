import { Howl } from 'howler'

export enum CardStatus {
  'face-down',
  'face-up',
  'purchased',
  'disabled',
  undefined,
}

export interface Card {
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
  status?: CardStatus
}
