import { Howl, HowlCallback } from 'howler'

interface GetSoundOptions {
  src: string
  volume?: number
  onload?: HowlCallback
}

export function getSound(options: GetSoundOptions) {
  return new Howl({
    preload: true,
    src: [options.src],
    volume: options.volume,
    onload: options.onload,
  })
}
