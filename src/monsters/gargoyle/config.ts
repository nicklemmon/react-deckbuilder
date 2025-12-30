import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Gargoyle',
  level: 3,
  goldBounty: 2,
  gameMode: 'standard',
  stats: {
    maxHealth: 4,
    health: 4,
    attack: 2,
    defense: 3,
  },
})
