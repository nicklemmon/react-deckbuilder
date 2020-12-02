import Monster from 'src/interfaces/Monster'
import batImg from 'src/images/bat.png'
import impImg from 'src/images/imp.png'
import stagImg from 'src/images/stag.png'
import theCouncilImg from 'src/images/the-council.png'
import arachnidImg from 'src/images/arachnid.png'
import trollImg from 'src/images/troll.png'
import zombieImg from 'src/images/zombie.png'

const imp: Monster = {
  id: 'imp',
  name: 'Imp',
  level: 2,
  artwork: impImg,
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
  artwork: stagImg,
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
  artwork: batImg,
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
  artwork: theCouncilImg,
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
  artwork: arachnidImg,
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
  artwork: trollImg,
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
  artwork: zombieImg,
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 3,
    defense: 9,
  },
}

export default [imp, stagSpirit, bat, theCouncil, arachnid, troll, zombie]
