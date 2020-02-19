import Card from '../../interfaces/Card'

const knight: Card = {
  id: 'knight',
  name: 'Knight',
  rarity: 1,
  description: 'A gallant knight',
  stats: {
    attack: 3,
    defense: 4,
  },
}

const peasant: Card = {
  id: 'peasant',
  name: 'Peasant',
  rarity: 0,
  description: 'A lowly peasant',
  stats: {
    attack: 1,
    defense: 1,
  },
}

const goblin: Card = {
  id: 'goblin',
  name: 'Goblin',
  rarity: 0,
  description: 'A nasty little goblin',
  stats: {
    attack: 2,
    defense: 3,
  },
}

const dwarf: Card = {
  id: 'dwarf',
  name: 'Dwarf',
  rarity: 1,
  description: 'A sturdy dwarf',
  stats: {
    attack: 3,
    defense: 5,
  },
}

export { knight, peasant, goblin, dwarf }
