import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createActor } from 'xstate'
import { soundtrackMachine } from '../soundtrack-machine'
import * as fadeSound from '../../../helpers/fade-sound'
import { TRACKS } from '../tracks'

vi.mock('../../../helpers/fade-sound', () => ({
  fadeIn: vi.fn(),
  fadeOut: vi.fn(),
}))

vi.mock('../tracks', () => ({
  TRACKS: {
    battle: {
      id: 'battle',
      sound: { playing: vi.fn(() => false) },
      baseVolume: 0.7,
    },
    store: {
      id: 'store',
      sound: { playing: vi.fn(() => false) },
      baseVolume: 0.5,
    },
    boogie: {
      id: 'boogie',
      sound: { playing: vi.fn(() => false) },
      baseVolume: 1.0,
    },
  },
}))

describe('soundtrackMachine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start in silent state', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    expect(actor.getSnapshot().value).toBe('silent')
    expect(actor.getSnapshot().context.currentTrack).toBeNull()
  })

  it('should transition to playing when PLAY_TRACK is sent', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    actor.send({ type: 'PLAY_TRACK', track: 'battle' })

    expect(actor.getSnapshot().value).toBe('playing')
    expect(actor.getSnapshot().context.currentTrack).toBe('battle')
  })

  it('should fade in track with base volume when playing', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    actor.send({ type: 'PLAY_TRACK', track: 'battle' })

    expect(fadeSound.fadeIn).toHaveBeenCalledWith(TRACKS.battle.sound, {
      duration: 500,
      targetVolume: 0.7,
    })
  })

  it('should cross-fade when switching tracks', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    // Start battle music
    actor.send({ type: 'PLAY_TRACK', track: 'battle' })
    vi.clearAllMocks()

    // Switch to store music
    actor.send({ type: 'PLAY_TRACK', track: 'store' })

    expect(fadeSound.fadeOut).toHaveBeenCalledWith(TRACKS.battle.sound, {
      duration: 500,
    })
    expect(fadeSound.fadeIn).toHaveBeenCalledWith(TRACKS.store.sound, {
      duration: 500,
      targetVolume: 0.5,
    })
    expect(actor.getSnapshot().context.currentTrack).toBe('store')
  })

  it('should not cross-fade when same track is played', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    actor.send({ type: 'PLAY_TRACK', track: 'battle' })
    vi.clearAllMocks()

    // Try to play battle again
    actor.send({ type: 'PLAY_TRACK', track: 'battle' })

    // Should not trigger any fades
    expect(fadeSound.fadeOut).not.toHaveBeenCalled()
    expect(fadeSound.fadeIn).not.toHaveBeenCalled()
    expect(actor.getSnapshot().value).toBe('playing')
  })

  it('should transition to silent when STOP is sent', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    actor.send({ type: 'PLAY_TRACK', track: 'battle' })
    actor.send({ type: 'STOP' })

    expect(actor.getSnapshot().value).toBe('silent')
    expect(actor.getSnapshot().context.currentTrack).toBeNull()
    expect(fadeSound.fadeOut).toHaveBeenCalledWith(TRACKS.battle.sound, {
      duration: 500,
    })
  })

  it('should update fade duration when SET_FADE_DURATION is sent', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    actor.send({ type: 'SET_FADE_DURATION', duration: 1000 })

    expect(actor.getSnapshot().context.fadeDuration).toBe(1000)

    // Now play a track and verify the new duration is used
    actor.send({ type: 'PLAY_TRACK', track: 'battle' })

    expect(fadeSound.fadeIn).toHaveBeenCalledWith(TRACKS.battle.sound, {
      duration: 1000,
      targetVolume: 0.7,
    })
  })

  it('should respect base volume for different tracks', () => {
    const actor = createActor(soundtrackMachine)
    actor.start()

    // Play battle music (base volume 0.7)
    actor.send({ type: 'PLAY_TRACK', track: 'battle' })
    expect(fadeSound.fadeIn).toHaveBeenCalledWith(TRACKS.battle.sound, {
      duration: 500,
      targetVolume: 0.7,
    })

    vi.clearAllMocks()

    // Switch to boogie music (base volume 1.0)
    actor.send({ type: 'PLAY_TRACK', track: 'boogie' })
    expect(fadeSound.fadeIn).toHaveBeenCalledWith(TRACKS.boogie.sound, {
      duration: 500,
      targetVolume: 1.0,
    })
  })
})
