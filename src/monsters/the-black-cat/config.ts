import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'The Black Cat',
  level: 2,
  goldBounty: 4,
  stats: {
    maxHealth: 6,
    health: 6,
    attack: 3,
    defense: 3,
  },
})
