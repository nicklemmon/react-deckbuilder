import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Ronin',
  level: 3,
  goldBounty: 9,
  gameMode: 'standard',
  stats: {
    maxHealth: 9,
    health: 9,
    attack: 7,
    defense: 4,
  },
})
