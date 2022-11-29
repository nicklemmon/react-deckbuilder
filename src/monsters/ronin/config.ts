import { defineMonster } from '../../functions/monsters'

export default defineMonster({
  name: 'Ronin',
  level: 3,
  goldBounty: 9,
  stats: {
    maxHealth: 9,
    health: 9,
    attack: 7,
    defense: 4,
  },
})
