import { Howl, type HowlCallback, type HowlOptions } from 'howler'

/** Wrapper function to get sound for use in the application */
export function getSound(options: {
  src: string
  volume?: number
  loop?: HowlOptions['loop']
  load?: HowlCallback
}) {
  return new Howl({
    preload: true,
    autoplay: false,
    loop: options.loop,
    src: [options.src],
    volume: options.volume,
    onload: options.load,
  })
}
