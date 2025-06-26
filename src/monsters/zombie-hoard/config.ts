import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Zombie Hoard',
  level: 5,
  goldBounty: 8,
  stats: {
    maxHealth: 30,
    health: 30,
    attack: 3,
    defense: 1,
  },
})
