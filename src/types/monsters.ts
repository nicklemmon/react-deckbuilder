import { Howl } from 'howler'

export type Monster = {
  id: string
  status: 'idle' | 'defeated'
  name: string
  level: number
  goldBounty: number
  artwork?: string
  damageTaken?: number
  sfx?: {
    intro: Howl
    damage: Howl
    death: Howl
  }
  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }
}