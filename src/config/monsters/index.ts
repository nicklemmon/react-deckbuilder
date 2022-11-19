import { getSound } from '../../functions'
import { Monster } from '../../interfaces/Monster'
import ImpImg from '../../images/monsters/imp.png'
import HauntingSpiritImg from '../../images/monsters/haunting-spirit.png'
import TheCouncilImg from '../../images/monsters/the-council.png'
import ArachnidImg from '../../images/monsters/arachnid.png'
import TrollImg from '../../images/monsters/troll.png'
import ZombieImg from '../../images/monsters/zombie.png'
import BoneDragonImg from '../../images/monsters/bone-dragon.png'
import GargoyleImg from '../../images/monsters/gargoyle.png'
import AncientGiantImg from '../../images/monsters/ancient-giant.png'
import TrollIntroSfx from '../../sounds/troll.intro.wav'
import TrollDamageSfx from '../../sounds/troll.damage.wav'
import TrollDeathSfx from '../../sounds/troll.death.wav'
import ImpIntroSfx from '../../sounds/imp.intro.wav'
import ImpDamageSfx from '../../sounds/imp.damage.wav'
import ImpDeathSfx from '../../sounds/imp.death.wav'
import ZombieIntroSfx from '../../sounds/zombie.intro.wav'
import ZombieDamageSfx from '../../sounds/zombie.damage.wav'
import ZombieDeathSfx from '../../sounds/zombie.death.wav'
import TheCouncilIntroSfx from '../../sounds/the-council.intro.wav'
import TheCouncilDamageSfx from '../../sounds/the-council.damage.wav'
import TheCouncilDeathSfx from '../../sounds/the-council.death.wav'
import HauntingSpiritIntroSfx from '../../sounds/haunting-spirit.intro.wav'
import HauntingSpiritDamageSfx from '../../sounds/haunting-spirit.damage.wav'
import HauntingSpiritDeathSfx from '../../sounds/haunting-spirit.death.wav'
import BoneDragonIntroSfx from '../../sounds/bone-dragon.intro.wav'
import BoneDragonDamageSfx from '../../sounds/bone-dragon.damage.wav'
import BoneDragonDeathSfx from '../../sounds/bone-dragon.death.wav'
import GargoyleIntroSfx from '../../sounds/gargoyle.intro.wav'
import GargoyleDamageSfx from '../../sounds/gargoyle.damage.wav'
import GargoyleDeathSfx from '../../sounds/gargoyle.death.wav'
import ArachnidIntroSfx from '../../sounds/arachnid.intro.wav'
import ArachnidDamageSfx from '../../sounds/arachnid.damage.wav'
import ArachnidDeathSfx from '../../sounds/arachnid.death.wav'
import AncientGiantIntroSfx from '../../sounds/ancient-giant.intro.wav'
import AncientGiantDamageSfx from '../../sounds/ancient-giant.damage.wav'
import AncientGiantDeathSfx from '../../sounds/ancient-giant.death.wav'

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

const hauntingSpirit: Monster = {
  id: 'haunting-spirit',
  name: 'Haunting Spirit',
  level: 4,
  artwork: HauntingSpiritImg,
  goldBounty: 5,
  sfx: {
    intro: getMonsterSound(HauntingSpiritIntroSfx),
    damage: getMonsterSound(HauntingSpiritDamageSfx),
    death: getMonsterSound(HauntingSpiritDeathSfx),
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

const ancientGiant: Monster = {
  id: 'ancient-giant',
  name: 'Ancient Giant',
  level: 7,
  artwork: AncientGiantImg,
  goldBounty: 10,
  sfx: {
    intro: getMonsterSound(AncientGiantIntroSfx),
    damage: getMonsterSound(AncientGiantDamageSfx),
    death: getMonsterSound(AncientGiantDeathSfx),
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
  hauntingSpirit,
  theCouncil,
  arachnid,
  troll,
  zombie,
  boneDragon,
  gargoyle,
  ancientGiant,
]
