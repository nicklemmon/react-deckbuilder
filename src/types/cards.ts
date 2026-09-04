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
  align?: 'left' | 'right' | undefined
  artwork?: string | undefined
  status?: 'disabled' | 'in-play' | 'idle' | undefined
  orientation?: 'face-up' | 'face-down' | undefined
}
