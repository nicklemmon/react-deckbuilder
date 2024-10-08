import type { Howl } from 'howler'

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
  // TODO: Can this be removed?
  align?: 'left' | 'right'
  artwork?: string
  status?: 'disabled' | 'in-play' | 'idle'
  orientation?: 'face-up' | 'face-down'
}
