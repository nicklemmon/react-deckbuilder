import type { Howl } from 'howler'
import { getSound } from '../../helpers/get-sound'
import battleMusicSfx from '../../sfx/music/music.battle.wav'
import boogieMusicSfx from '../../sfx/music/music.boogie.wav'
import introMusicSfx from '../../sfx/music/music.intro.wav'
import storeMusicSfx from '../../sfx/music/music.store.wav'

/** Identifier for available music tracks in the game */
export type TrackId = 'battle' | 'store' | 'boogie' | 'intro'

/** Represents a music track with its Howl instance and volume settings */
export type Track = {
  id: TrackId
  sound: Howl
  baseVolume: number
}

/**
 * Central registry of all music tracks in the game.
 * Each track is created once and shared across the application to ensure
 * the soundtrack machine can properly coordinate playback and cross-fading.
 */
export const TRACKS: Record<TrackId, Track> = {
  battle: {
    id: 'battle',
    sound: getSound({ src: battleMusicSfx, volume: 0.4, loop: true }),
    baseVolume: 0.4,
  },
  intro: {
    id: 'intro',
    sound: getSound({ src: introMusicSfx, volume: 0.4, loop: true }),
    baseVolume: 0.4,
  },
  store: {
    id: 'store',
    sound: getSound({ src: storeMusicSfx, volume: 1.0, loop: true }),
    baseVolume: 0.7,
  },
  boogie: {
    id: 'boogie',
    sound: getSound({ src: boogieMusicSfx, volume: 1.0, loop: true }),
    baseVolume: 1.0,
  },
}
