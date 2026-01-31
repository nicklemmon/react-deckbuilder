import type { Howl } from 'howler'
import { getSound } from '../../helpers/get-sound'
import battleMusicSfx from '../../sfx/music/music.battle.wav'
import storeMusicSfx from '../../sfx/music/music.store.wav'
import boogieMusicSfx from '../../sfx/music/music.boogie.wav'

export type TrackId = 'battle' | 'store' | 'boogie'

export type Track = {
  id: TrackId
  sound: Howl
  baseVolume: number
}

export const TRACKS: Record<TrackId, Track> = {
  battle: {
    id: 'battle',
    sound: getSound({ src: battleMusicSfx, volume: 0.7, loop: true }),
    baseVolume: 0.7,
  },
  store: {
    id: 'store',
    sound: getSound({ src: storeMusicSfx, volume: 0.7, loop: true }),
    baseVolume: 0.7,
  },
  boogie: {
    id: 'boogie',
    sound: getSound({ src: boogieMusicSfx, volume: 1.0, loop: true }),
    baseVolume: 1.0,
  },
}
