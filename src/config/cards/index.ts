import Card from '../../interfaces/Card'

const strike: Card = {
  id: 'strike',
  name: 'Strike',
  description: 'Smack your opponent!',
  rarity: 0,
  stats: {
    attack: 3,
  },
}

const slam: Card = {
  id: 'slam',
  name: 'Slam',
  description: 'SLAM.',
  rarity: 0,
  stats: {
    attack: 5,
  },
}

const block: Card = {
  id: 'block',
  name: 'Block',
  description: 'Block incoming damage',
  rarity: 0,
  stats: {
    defend: 3,
  },
}

const assassinate: Card = {
  id: 'assassinate',
  name: 'Assassinate',
  description: 'Back stab for huge damage!',
  rarity: 1,
  stats: {
    attack: 8,
  },
}

const punch: Card = {
  id: 'punch',
  name: 'Punch',
  description: 'Right in the ribs',
  rarity: 0,
  stats: {
    attack: 1,
  },
}

export default [strike, slam, block, assassinate, punch]
