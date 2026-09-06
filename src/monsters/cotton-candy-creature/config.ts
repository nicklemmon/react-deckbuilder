import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Cotton Candy Creature',
  level: 6,
  goldBounty: 8,
  gameMode: 'rainbow',
  stats: {
    maxHealth: 14,
    health: 14,
    attack: 7,
    defense: 3,
  },
})
