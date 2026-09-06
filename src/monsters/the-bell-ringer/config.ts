import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'The Bell-Ringer',
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
