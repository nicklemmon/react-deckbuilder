import { defineMonster } from '../../functions/monsters'

export default defineMonster({
  name: 'Vile Wizard',
  level: 5,
  goldBounty: 15,
  stats: {
    maxHealth: 6,
    health: 6,
    attack: 12,
    defense: 3,
  },
})
