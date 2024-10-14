import { Howl, type HowlCallback } from 'howler'

/** Wrapper function to get sound for use in the application */
export function getSound(options: { src: string; volume?: number; onload?: HowlCallback }) {
  return new Howl({
    preload: true,
    autoplay: false,
    src: [options.src],
    volume: options.volume,
    onload: options.onload,
  })
}
