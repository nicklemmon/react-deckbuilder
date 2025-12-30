import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Arachnid',
  level: 4,
  goldBounty: 5,
  gameMode: 'standard',
  stats: {
    maxHealth: 6,
    health: 6,
    attack: 4,
    defense: 2,
  },
})
