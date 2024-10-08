import { Howl } from 'howler'
import type { AvatarStatus } from '../components/avatar'

export type Monster = {
  id: string
  status: AvatarStatus
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
