import type { Item } from '../types/items'
import { getSound } from './get-sound'

/** Defines an item config */
export function defineItem(config: Omit<Item, 'id' | 'artwork' | 'sfx'>) {
  return config
}

/** Returns an item from an array by its id */
export function getItem(id: string, items: Array<Item>) {
  return [...items].find((item) => item.id === id) as Item
}

/** Starting volume for monster sound effects */
const ITEM_SFX_VOLUME = 0.75

/** Retrieves monster sound with build in defaults */
const getItemSound = (sfx: string) => getSound({ src: sfx, volume: ITEM_SFX_VOLUME })

const ITEM_CONFIG_MODULES = import.meta.glob('../items/**/config.ts', {
  eager: true,
  import: 'default',
})

const ITEM_SFX_MODULES = import.meta.glob('../items/**/*.wav', {
  eager: true,
  import: 'default',
})

const ITEM_ARTWORK = import.meta.glob('../items/**/*.png', {
  eager: true,
  import: 'default',
})

/** Array of available monsters derived from `src/monsters` file contents */
export const getAllItems = () =>
  Object.entries(ITEM_CONFIG_MODULES).map(([path, mod]) => {
    const dir = path.replace('/config.ts', '')
    const id = dir.replace('../items/', '')

    return {
      ...(mod as Item),
      id,
      artwork: ITEM_ARTWORK[`${dir}/artwork.png`],
      sfx: {
        obtain: getItemSound(ITEM_SFX_MODULES[`${dir}/sfx.obtain.wav`] as string),
        use: getItemSound(ITEM_SFX_MODULES[`${dir}/sfx.use.wav`] as string),
        effect: getItemSound(ITEM_SFX_MODULES[`${dir}/sfx.effect.wav`] as string),
      },
    }
  }) as Array<Item>
