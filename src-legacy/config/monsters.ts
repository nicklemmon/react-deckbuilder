import { getSound } from '../functions'
import type { Monster } from '../interfaces/Monster'

/** Starting volume for monster sound effects */
const MONSTER_SFX_VOLUME = 0.55

/** Retrieves monster sound with build in defaults */
const getMonsterSound = (sfx: string) => getSound({ src: sfx, volume: MONSTER_SFX_VOLUME })

const monsters = import.meta.glob('../monsters/**/config.ts', { eager: true, import: 'default' })
const monstersSfx = import.meta.glob('../monsters/**/*.wav', { eager: true, import: 'default' })
const monstersArtwork = import.meta.glob('../monsters/**/*.png', {
  eager: true,
  import: 'default',
})

/** Array of available monsters derived from `src/monsters` file contents */
const monstersArr = Object.entries(monsters).map(([path, mod]) => {
  const dir = path.replace('/config.ts', '')
  const id = dir.replace('../monsters/', '')

  return {
    ...(mod as Monster),
    id,
    artwork: monstersArtwork[`${dir}/artwork.png`],
    sfx: {
      intro: getMonsterSound(monstersSfx[`${dir}/sfx.intro.wav`] as string),
      damage: getMonsterSound(monstersSfx[`${dir}/sfx.damage.wav`] as string),
      death: getMonsterSound(monstersSfx[`${dir}/sfx.death.wav`] as string),
    },
  }
}) as Array<Monster>

export default monstersArr
