import type { Howl } from 'howler'

export type Item = {
  id: string
  name: string
  type: 'healing' | 'buff'
  value: number
  cost: number
  artwork: string
  sfx: {
    obtain: Howl
    use: Howl
    effect: Howl
  }
}
