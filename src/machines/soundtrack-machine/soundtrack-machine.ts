import { assign, setup } from 'xstate'
import { fadeIn, fadeOut } from '../../helpers/fade-sound'
import { TRACKS, type TrackId } from './tracks'

const DEFAULT_FADE_DURATION = 500

type SoundtrackContext = {
  currentTrack: TrackId | null
  fadeDuration: number
}

type SoundtrackEvent =
  | { type: 'PLAY_TRACK'; track: TrackId }
  | { type: 'STOP' }
  | { type: 'SET_FADE_DURATION'; duration: number }

export const soundtrackMachine = setup({
  types: {
    context: {} as SoundtrackContext,
    events: {} as SoundtrackEvent,
  },
  actions: {
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

      // Fade in new track
      const newTrack = TRACKS[newTrackId]
      fadeIn(newTrack.sound, { duration })
    },
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
