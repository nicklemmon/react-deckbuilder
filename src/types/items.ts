import { Howl } from 'howler'

export type Item = {
  id: string
  name: string
  description?: string
  artwork: string
  sfx: {
    obtain: Howl
    use: Howl
    effect: Howl
  }
  price: number
  stats: {
    health?: number
    // TODO: an Item should be able to do more than just heal
  }
  status?: 'idle' | 'purchased' | 'disabled'
}
