import { Howl } from 'howler'

export interface Monster {
  id: string
  name: string
  level: number
  goldBounty: number
  artwork?: string
  damageTaken?: number

  sfx: {
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
