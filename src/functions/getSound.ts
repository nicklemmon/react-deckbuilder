import { Howl } from 'howler'

interface GetSoundOptions {
  src: string
  volume?: number
}

export function getSound(options: GetSoundOptions) {
  return new Howl({
    preload: true,
    src: [options.src],
    volume: options.volume,
  })
}
