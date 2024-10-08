import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Troll',
  level: 8,
  goldBounty: 9,
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 7,
    defense: 7,
  },
})
