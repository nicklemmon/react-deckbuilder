import { Howl, type HowlCallback } from 'howler'

export function getSound(options: { src: string; volume?: number; onload?: HowlCallback }) {
  return new Howl({
    preload: true,
    src: [options.src],
    volume: options.volume,
    onload: options.onload,
  })
}
