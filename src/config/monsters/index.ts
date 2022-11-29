import { getSound } from '../../functions'
import type { Monster } from '../../interfaces/Monster'
import TrollImg from '../../images/monsters/troll.png'
import ZombieImg from '../../images/monsters/zombie.png'
import BoneDragonImg from '../../images/monsters/bone-dragon.png'
import GargoyleImg from '../../images/monsters/gargoyle.png'
import AncientGiantImg from '../../images/monsters/ancient-giant.png'
import TrollIntroSfx from '../../sounds/troll.intro.wav'
import TrollDamageSfx from '../../sounds/troll.damage.wav'
import TrollDeathSfx from '../../sounds/troll.death.wav'
import ZombieIntroSfx from '../../sounds/zombie.intro.wav'
import ZombieDamageSfx from '../../sounds/zombie.damage.wav'
import ZombieDeathSfx from '../../sounds/zombie.death.wav'
import BoneDragonIntroSfx from '../../sounds/bone-dragon.intro.wav'
import BoneDragonDamageSfx from '../../sounds/bone-dragon.damage.wav'
import BoneDragonDeathSfx from '../../sounds/bone-dragon.death.wav'
import GargoyleIntroSfx from '../../sounds/gargoyle.intro.wav'
import GargoyleDamageSfx from '../../sounds/gargoyle.damage.wav'
import GargoyleDeathSfx from '../../sounds/gargoyle.death.wav'
import AncientGiantIntroSfx from '../../sounds/ancient-giant.intro.wav'
import AncientGiantDamageSfx from '../../sounds/ancient-giant.damage.wav'
import AncientGiantDeathSfx from '../../sounds/ancient-giant.death.wav'

const MONSTER_SFX_VOLUME = 0.55

const getMonsterSound = (sfx: string) => getSound({ src: sfx, volume: MONSTER_SFX_VOLUME })

const monsters = import.meta.glob('../../monsters/**/config.ts', { eager: true, import: 'default' })
const monstersSfx = import.meta.glob('../../monsters/**/*.wav', { eager: true, import: 'default' })
const monstersArtwork = import.meta.glob('../../monsters/**/*.png', {
  eager: true,
  import: 'default',
})

const monstersArr = Object.entries(monsters).map(([path, mod]) => {
  const dir = path.replace('/config.ts', '')
  const id = dir.replace('../../monsters/', '')

  return {
    /* @ts-expect-error */
    ...mod,
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
