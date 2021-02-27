import { Howl } from 'howler'

export interface Item {
  id: string
  name: string
  description?: string
  artwork: string
  sfx: {
    obtain: Howl
    use: Howl
  }
  isPurchased?: boolean
  isDisabled?: boolean
  price: number
  stats: {
    health?: number
    // TODO: an Item should be able to do more than just heal
  }
}
