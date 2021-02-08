import { Howl } from 'howler'

interface OptionsInterface {
  src: string
}

export function useSound(options: OptionsInterface) {
  return new Howl({ src: [options.src] })
}
