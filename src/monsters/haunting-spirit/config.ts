import { defineMonster } from '../../functions/monsters'

export default defineMonster({
  name: 'Haunting Spirit',
  level: 4,
  goldBounty: 5,
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 2,
    defense: 0,
  },
})
