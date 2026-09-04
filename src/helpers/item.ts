import type { Item } from '../types/items'
import { getSound } from './get-sound'
import { requireAsset } from './vite'

/** Defines an item config */
export function defineItem(config: Omit<Item, 'id' | 'artwork' | 'sfx'>) {
  return config
}

/** Returns an item from an array by its id */
export function getItem(id: string, items: readonly Item[]): Item | undefined {
  return items.find((item) => item.id === id)
}

/** Gets a required item. Throws when the item list does not contain the item. */
export function requireItem(id: string, items: readonly Item[]): Item {
  const item = getItem(id, items)
  if (!item) throw new Error(`Unknown item: ${id}`)
  return item
}

/** Starting volume for monster sound effects */
const ITEM_SFX_VOLUME = 0.75

/** Retrieves monster sound with build in defaults */
const getItemSound = (sfx: string) => getSound({ src: sfx, volume: ITEM_SFX_VOLUME })

const ITEM_CONFIG_MODULES = import.meta.glob<Omit<Item, 'id' | 'artwork' | 'sfx'>>(
  '../items/**/config.ts',
  {
    eager: true,
    import: 'default',
  },
)

const ITEM_SFX_MODULES = import.meta.glob<string>('../items/**/*.wav', {
  eager: true,
  import: 'default',
})

const ITEM_ARTWORK = import.meta.glob<string>('../items/**/*.webp', {
  eager: true,
  import: 'default',
  query: { format: 'webp' },
})

/** Array of available monsters derived from `src/monsters` file contents */
export const getAllItems = () =>
  Object.entries(ITEM_CONFIG_MODULES).map(([path, mod]) => {
    const dir = path.replace('/config.ts', '')
    const id = dir.replace('../items/', '')

    return {
      ...mod,
      id,
      artwork: requireAsset(ITEM_ARTWORK, `${dir}/artwork.webp`),
      sfx: {
        obtain: getItemSound(requireAsset(ITEM_SFX_MODULES, `${dir}/sfx.obtain.wav`)),
        use: getItemSound(requireAsset(ITEM_SFX_MODULES, `${dir}/sfx.use.wav`)),
        effect: getItemSound(requireAsset(ITEM_SFX_MODULES, `${dir}/sfx.effect.wav`)),
      },
    }
  }) satisfies Item[]
