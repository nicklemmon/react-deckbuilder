import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Orc',
  level: 3,
  goldBounty: 4,
  stats: {
    maxHealth: 8,
    health: 8,
    attack: 3,
    defense: 2,
  },
})
