import Monster from '../../interfaces/Monster'

const imp: Monster = {
  id: 'imp',
  name: 'Imp',
  level: 2,
  stats: {
    hitPoints: 40,
    attack: 4,
    defense: 2,
  },
}

const troll: Monster = {
  id: 'troll',
  name: 'Troll',
  level: 6,
  stats: {
    hitPoints: 40,
    attack: 6,
    defense: 8,
  },
}

const orc: Monster = {
  id: 'orc',
  name: 'Orc',
  level: 1,
  stats: {
    hitPoints: 25,
    attack: 3,
    defense: 3,
  },
}

export default [imp, troll, orc]
