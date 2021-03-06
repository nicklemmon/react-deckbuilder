import { getSound } from 'src/functions'
import { Monster } from 'src/interfaces/Monster'
import ImpImg from 'src/images/imp.png'
import StagImg from 'src/images/stag.png'
import TheCouncilImg from 'src/images/the-council.png'
import ArachnidImg from 'src/images/arachnid.png'
import TrollImg from 'src/images/troll.png'
import ZombieImg from 'src/images/zombie.png'
import BoneDragonImg from 'src/images/bone-dragon.png'
import GargoyleImg from 'src/images/gargoyle.png'
import BambooGiantImg from 'src/images/bamboo-giant.png'
import TrollIntroSfx from 'src/sounds/troll.intro.wav'
import TrollDamageSfx from 'src/sounds/troll.damage.wav'
import TrollDeathSfx from 'src/sounds/troll.death.wav'
import ImpIntroSfx from 'src/sounds/imp.intro.wav'
import ImpDamageSfx from 'src/sounds/imp.damage.wav'
import ImpDeathSfx from 'src/sounds/imp.death.wav'
import ZombieIntroSfx from 'src/sounds/zombie.intro.wav'
import ZombieDamageSfx from 'src/sounds/zombie.damage.wav'
import ZombieDeathSfx from 'src/sounds/zombie.death.wav'
import TheCouncilIntroSfx from 'src/sounds/the-council.intro.wav'
import TheCouncilDamageSfx from 'src/sounds/the-council.damage.wav'
import TheCouncilDeathSfx from 'src/sounds/the-council.death.wav'
import StagSpiritIntroSfx from 'src/sounds/stag-spirit.intro.wav'
import StagSpiritDamageSfx from 'src/sounds/stag-spirit.damage.wav'
import StagSpiritDeathSfx from 'src/sounds/stag-spirit.death.wav'
import BoneDragonIntroSfx from 'src/sounds/bone-dragon.intro.wav'
import BoneDragonDamageSfx from 'src/sounds/bone-dragon.damage.wav'
import BoneDragonDeathSfx from 'src/sounds/bone-dragon.death.wav'
import GargoyleIntroSfx from 'src/sounds/gargoyle.intro.wav'
import GargoyleDamageSfx from 'src/sounds/gargoyle.damage.wav'
import GargoyleDeathSfx from 'src/sounds/gargoyle.death.wav'
import ArachnidIntroSfx from 'src/sounds/arachnid.intro.wav'
import ArachnidDamageSfx from 'src/sounds/arachnid.damage.wav'
import ArachnidDeathSfx from 'src/sounds/arachnid.death.wav'
import BambooGiantIntroSfx from 'src/sounds/bamboo-giant.intro.wav'
import BambooGiantDamageSfx from 'src/sounds/bamboo-giant.damage.wav'
import BambooGiantDeathSfx from 'src/sounds/bamboo-giant.death.wav'

const MONSTER_SFX_VOLUME = 0.55

const getMonsterSound = (sfx: string) => getSound({ src: sfx, volume: MONSTER_SFX_VOLUME })

const imp: Monster = {
  id: 'imp',
  name: 'Imp',
  level: 2,
  artwork: ImpImg,
  goldBounty: 1,
  sfx: {
    intro: getMonsterSound(ImpIntroSfx),
    damage: getMonsterSound(ImpDamageSfx),
    death: getMonsterSound(ImpDeathSfx),
  },
  stats: {
    maxHealth: 12,
    health: 12,
    attack: 4,
    defense: 2,
  },
}

const stagSpirit: Monster = {
  id: 'stag-spirit',
  name: 'Stag Spirit',
  level: 4,
  artwork: StagImg,
  goldBounty: 5,
  sfx: {
    intro: getMonsterSound(StagSpiritIntroSfx),
    damage: getMonsterSound(StagSpiritDamageSfx),
    death: getMonsterSound(StagSpiritDeathSfx),
  },
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 2,
    defense: 0,
  },
}

const theCouncil: Monster = {
  id: 'the-council',
  name: 'The Council',
  level: 8,
  artwork: TheCouncilImg,
  goldBounty: 7,
  sfx: {
    intro: getMonsterSound(TheCouncilIntroSfx),
    damage: getMonsterSound(TheCouncilDamageSfx),
    death: getMonsterSound(TheCouncilDeathSfx),
  },
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 10,
    defense: 3,
  },
}

const arachnid: Monster = {
  id: 'arachnid',
  name: 'Arachnid',
  level: 4,
  artwork: ArachnidImg,
  goldBounty: 5,
  sfx: {
    intro: getMonsterSound(ArachnidIntroSfx),
    damage: getMonsterSound(ArachnidDamageSfx),
    death: getMonsterSound(ArachnidDeathSfx),
  },
  stats: {
    maxHealth: 6,
    health: 6,
    attack: 4,
    defense: 2,
  },
}

const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  level: 8,
  artwork: TrollImg,
  goldBounty: 9,
  sfx: {
    intro: getMonsterSound(TrollIntroSfx),
    damage: getMonsterSound(TrollDamageSfx),
    death: getMonsterSound(TrollDeathSfx),
  },
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 7,
    defense: 7,
  },
}

const zombie: Monster = {
  id: 'zombie',
  name: 'Zombie',
  level: 3,
  artwork: ZombieImg,
  goldBounty: 2,
  sfx: {
    intro: getMonsterSound(ZombieIntroSfx),
    damage: getMonsterSound(ZombieDamageSfx),
    death: getMonsterSound(ZombieDeathSfx),
  },
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 3,
    defense: 9,
  },
}

const boneDragon: Monster = {
  id: 'bone-dragon',
  name: 'Bone Dragon',
  level: 8,
  artwork: BoneDragonImg,
  goldBounty: 10,
  sfx: {
    intro: getMonsterSound(BoneDragonIntroSfx),
    damage: getMonsterSound(BoneDragonDamageSfx),
    death: getMonsterSound(BoneDragonDeathSfx),
  },
  stats: {
    maxHealth: 20,
    health: 20,
    attack: 8,
    defense: 8,
  },
}

const gargoyle: Monster = {
  id: 'gargoyle',
  name: 'Gargoyle',
  level: 3,
  artwork: GargoyleImg,
  goldBounty: 2,
  sfx: {
    intro: getMonsterSound(GargoyleIntroSfx),
    damage: getMonsterSound(GargoyleDamageSfx),
    death: getMonsterSound(GargoyleDeathSfx),
  },
  stats: {
    maxHealth: 4,
    health: 4,
    attack: 2,
    defense: 3,
  },
}

const bambooGiant: Monster = {
  id: 'bamboo-giant',
  name: 'Bamboo Giant',
  level: 7,
  artwork: BambooGiantImg,
  goldBounty: 10,
  sfx: {
    intro: getMonsterSound(BambooGiantIntroSfx),
    damage: getMonsterSound(BambooGiantDamageSfx),
    death: getMonsterSound(BambooGiantDeathSfx),
  },
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 4,
    defense: 5,
  },
}

// eslint-disable-next-line
export default [
  imp,
  stagSpirit,
  theCouncil,
  arachnid,
  troll,
  zombie,
  boneDragon,
  gargoyle,
  bambooGiant,
]
