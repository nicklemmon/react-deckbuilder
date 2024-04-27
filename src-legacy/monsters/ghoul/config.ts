import { defineMonster } from '../../functions/monsters'

export default defineMonster({
  name: 'Ghoul',
  level: 6,
  goldBounty: 9,
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 6,
    defense: 2,
  },
})
