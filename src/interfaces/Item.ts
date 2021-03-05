import { Howl } from 'howler'

export enum ItemStatus {
  'idle',
  'purchased',
  'disabled',
}

export interface Item {
  id: string
  name: string
  description?: string
  artwork: string
  sfx: {
    obtain: Howl
    use: Howl
  }
  price: number
  stats: {
    health?: number
    // TODO: an Item should be able to do more than just heal
  }
  status?: ItemStatus | undefined
}
