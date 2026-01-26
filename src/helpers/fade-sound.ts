import type { Howl } from 'howler'

const DEFAULT_FADE_DURATION = 500

/** Track pending stop timeouts per sound to cancel them on fadeIn */
const pendingStops = new WeakMap<Howl, ReturnType<typeof setTimeout>>()

type FadeOptions = {
  /** Duration of the fade in milliseconds (default: 500) */
  duration?: number
}

/** Fade in a sound from silence to full volume */
export function fadeIn(sound: Howl, options: FadeOptions = {}) {
  const { duration = DEFAULT_FADE_DURATION } = options

  // Cancel any pending stop from a previous fadeOut
  const pendingTimeout = pendingStops.get(sound)
  if (pendingTimeout) {
    clearTimeout(pendingTimeout)
    pendingStops.delete(sound)
  }

  // Only start playback if not already playing
  if (!sound.playing()) {
    sound.volume(0)
    sound.play()
  }

  // Fade from current volume to full
  const currentVolume = sound.volume()
  sound.fade(currentVolume, 1, duration)
}

/** Fade out a sound from current volume to silence, then stop */
export function fadeOut(sound: Howl, options: FadeOptions = {}) {
  const { duration = DEFAULT_FADE_DURATION } = options

  if (sound.playing()) {
    const currentVolume = sound.volume()
    sound.fade(currentVolume, 0, duration)

    const timeoutId = setTimeout(() => {
      sound.stop()
      pendingStops.delete(sound)
    }, duration)

    pendingStops.set(sound, timeoutId)
  }
}
