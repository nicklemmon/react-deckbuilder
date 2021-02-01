import Monster from 'src/interfaces/Monster'
import BatImg from 'src/images/bat.png'
import ImpImg from 'src/images/imp.png'
import StagImg from 'src/images/stag.png'
import TheCouncilImg from 'src/images/the-council.png'
import ArachnidImg from 'src/images/arachnid.png'
import TrollImg from 'src/images/troll.png'
import ZombieImg from 'src/images/zombie.png'
import BoneDragonImg from 'src/images/bone-dragon.png'
import GargoyleImg from 'src/images/gargoyle.png'

const imp: Monster = {
  id: 'imp',
  name: 'Imp',
  level: 2,
  artwork: ImpImg,
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
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 2,
    defense: 0,
  },
}

const bat: Monster = {
  id: 'bat',
  name: 'Bat',
  level: 1,
  artwork: BatImg,
  stats: {
    maxHealth: 5,
    health: 5,
    attack: 2,
    defense: 0,
  },
}

const theCouncil: Monster = {
  id: 'the-council',
  name: 'The Council',
  level: 8,
  artwork: TheCouncilImg,
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
  stats: {
    maxHealth: 4,
    health: 4,
    attack: 2,
    defense: 3,
  },
}

export default [imp, stagSpirit, bat, theCouncil, arachnid, troll, zombie, boneDragon, gargoyle]
