import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fadeIn, fadeOut } from '../fade-sound'
import type { Howl } from 'howler'

describe('fade-sound', () => {
  let mockSound: Howl

  beforeEach(() => {
    vi.useFakeTimers()
    mockSound = {
      playing: vi.fn(() => false),
      volume: vi.fn(() => 0),
      play: vi.fn(),
      fade: vi.fn(),
      stop: vi.fn(),
    } as unknown as Howl
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('fadeIn', () => {
    it('should fade to volume 1 by default', () => {
      fadeIn(mockSound)

      expect(mockSound.fade).toHaveBeenCalledWith(0, 1, 500)
    })

    it('should fade to custom target volume when specified', () => {
      fadeIn(mockSound, { targetVolume: 0.7 })

      expect(mockSound.fade).toHaveBeenCalledWith(0, 0.7, 500)
    })

    it('should use custom duration when specified', () => {
      fadeIn(mockSound, { duration: 1000, targetVolume: 0.5 })

      expect(mockSound.fade).toHaveBeenCalledWith(0, 0.5, 1000)
    })

    it('should start playback if not already playing', () => {
      ;(mockSound.playing as any).mockReturnValue(false)

      fadeIn(mockSound)

      expect(mockSound.volume).toHaveBeenCalledWith(0)
      expect(mockSound.play).toHaveBeenCalled()
    })

    it('should not start playback if already playing', () => {
      ;(mockSound.playing as any).mockReturnValue(true)
      ;(mockSound.volume as any).mockReturnValue(0.5)

      fadeIn(mockSound)

      expect(mockSound.play).not.toHaveBeenCalled()
      expect(mockSound.fade).toHaveBeenCalledWith(0.5, 1, 500)
    })
  })

  describe('fadeOut', () => {
    beforeEach(() => {
      ;(mockSound.playing as any).mockReturnValue(true)
      ;(mockSound.volume as any).mockReturnValue(0.8)
    })

    it('should fade to silence and stop after duration', () => {
      fadeOut(mockSound)

      expect(mockSound.fade).toHaveBeenCalledWith(0.8, 0, 500)
      expect(mockSound.stop).not.toHaveBeenCalled()

      vi.advanceTimersByTime(500)

      expect(mockSound.stop).toHaveBeenCalled()
    })

    it('should use custom duration', () => {
      fadeOut(mockSound, { duration: 1000 })

      expect(mockSound.fade).toHaveBeenCalledWith(0.8, 0, 1000)

      vi.advanceTimersByTime(999)
      expect(mockSound.stop).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(mockSound.stop).toHaveBeenCalled()
    })

    it('should not fade if sound is not playing', () => {
      ;(mockSound.playing as any).mockReturnValue(false)

      fadeOut(mockSound)

      expect(mockSound.fade).not.toHaveBeenCalled()
      expect(mockSound.stop).not.toHaveBeenCalled()
    })

    it('should cancel pending stop when fadeIn is called', () => {
      fadeOut(mockSound, { duration: 500 })

      vi.advanceTimersByTime(250)

      // Now fade in before the stop happens
      ;(mockSound.playing as any).mockReturnValue(false)
      fadeIn(mockSound)

      // Advance past the original stop timeout
      vi.advanceTimersByTime(300)

      // Stop should not have been called because fadeIn cancelled it
      expect(mockSound.stop).not.toHaveBeenCalled()
    })
  })
})
