import { assign, setup } from 'xstate'
import { fadeIn, fadeOut } from '../../helpers/fade-sound'
import { TRACKS, type TrackId } from './tracks'

/** Default duration in milliseconds for fade in/out transitions */
const DEFAULT_FADE_DURATION = 500

/** State machine context that tracks the currently playing track and fade settings */
type SoundtrackContext = {
  currentTrack: TrackId | null
  fadeDuration: number
}

/** Events that can be sent to the soundtrack machine */
type SoundtrackEvent =
  | { type: 'PLAY_TRACK'; track: TrackId }
  | { type: 'STOP' }
  | { type: 'SET_FADE_DURATION'; duration: number }

/**
 * XState machine that manages music playback for the game.
 * Ensures only one track plays at a time and handles smooth cross-fading between tracks.
 * The machine has two states: silent (no music playing) and playing (one track active).
 */
export const soundtrackMachine = setup({
  types: {
    context: {} as SoundtrackContext,
    events: {} as SoundtrackEvent,
  },
  actions: {
    /**
     * Cross-fades from the current track to a new track.
     * Fades out the current track while simultaneously fading in the new one,
     * creating a smooth transition without jarring cuts or volume overlap.
     */
    crossFadeToTrack: ({ context, event }) => {
      if (event.type !== 'PLAY_TRACK') return

      const newTrackId = event.track
      const currentTrackId = context.currentTrack
      const duration = context.fadeDuration

      // Fade out current track if one is playing
      if (currentTrackId && currentTrackId !== newTrackId) {
        const currentTrack = TRACKS[currentTrackId]
        fadeOut(currentTrack.sound, { duration })
      }

      // Fade in new track to its base volume
      const newTrack = TRACKS[newTrackId]
      fadeIn(newTrack.sound, { duration, targetVolume: newTrack.baseVolume })
    },
    /**
     * Stops all music playback by fading out the current track.
     * Used when transitioning to the silent state.
     */
    stopAllTracks: ({ context }) => {
      const duration = context.fadeDuration

      // Fade out current track
      if (context.currentTrack) {
        const currentTrack = TRACKS[context.currentTrack]
        fadeOut(currentTrack.sound, { duration })
      }
    },
  },
}).createMachine({
  id: 'soundtrack',
  initial: 'silent',
  context: {
    currentTrack: null,
    fadeDuration: DEFAULT_FADE_DURATION,
  },
  states: {
    silent: {
      on: {
        PLAY_TRACK: {
          target: 'playing',
          actions: ['crossFadeToTrack', assign({ currentTrack: ({ event }) => event.track })],
        },
        SET_FADE_DURATION: {
          actions: assign({ fadeDuration: ({ event }) => event.duration }),
        },
      },
    },
    playing: {
      on: {
        PLAY_TRACK: {
          // Self-transition to trigger cross-fade
          target: 'playing',
          guard: ({ context, event }) => event.track !== context.currentTrack,
          actions: ['crossFadeToTrack', assign({ currentTrack: ({ event }) => event.track })],
        },
        STOP: {
          target: 'silent',
          actions: ['stopAllTracks', assign({ currentTrack: null })],
        },
        SET_FADE_DURATION: {
          actions: assign({ fadeDuration: ({ event }) => event.duration }),
        },
      },
    },
  },
})
