import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Imp',
  level: 2,
  goldBounty: 1,
  stats: {
    maxHealth: 12,
    health: 12,
    attack: 4,
    defense: 2,
  },
})
