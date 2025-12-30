import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'The Council',
  level: 8,
  goldBounty: 7,
  gameMode: 'standard',
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 10,
    defense: 3,
  },
})
