import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Bell-ringer',
  level: 9,
  goldBounty: 11,
  gameMode: 'standard',
  stats: {
    maxHealth: 18,
    health: 18,
    attack: 8,
    defense: 6,
  },
})
