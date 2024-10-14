import type { Monster } from '../types/monsters'
import { getSound } from './get-sound'

/** Helper function to define and configure a monster */
export function defineMonster(config: Omit<Monster, 'id' | 'artwork' | 'sfx' | 'status'>) {
  return config
}

/** Starting volume for monster sound effects */
const MONSTER_SFX_VOLUME = 0.55

/** Retrieves monster sound with build in defaults */
const getMonsterSound = (sfx: string) => getSound({ src: sfx, volume: MONSTER_SFX_VOLUME })

const MONSTER_CONFIG_MODULES = import.meta.glob('../monsters/**/config.ts', {
  eager: true,
  import: 'default',
})

const MONSTER_SFX_MODULES = import.meta.glob('../monsters/**/*.wav', {
  eager: true,
  import: 'default',
})

const MONSTER_ARTWORK = import.meta.glob('../monsters/**/*.png', {
  eager: true,
  import: 'default',
})

/** Array of available monsters derived from `src/monsters` file contents */
export const getAllMonsters = () =>
  Object.entries(MONSTER_CONFIG_MODULES).map(([path, mod]) => {
    const dir = path.replace('/config.ts', '')
    const id = dir.replace('../monsters/', '')

    return {
      ...(mod as Monster),
      id,
      artwork: MONSTER_ARTWORK[`${dir}/artwork.png`],
      sfx: {
        intro: getMonsterSound(MONSTER_SFX_MODULES[`${dir}/sfx.intro.wav`] as string),
        damage: getMonsterSound(MONSTER_SFX_MODULES[`${dir}/sfx.damage.wav`] as string),
        death: getMonsterSound(MONSTER_SFX_MODULES[`${dir}/sfx.death.wav`] as string),
      },
    }
  }) as Array<Monster>
