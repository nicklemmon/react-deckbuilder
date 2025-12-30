import { Howl } from 'howler'
import type { AvatarStatus } from '../components/avatar'
import type { GameMode } from './global'

export type Monster = {
  id: string
  status: AvatarStatus
  name: string
  level: number
  goldBounty: number
  gameMode: GameMode
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
