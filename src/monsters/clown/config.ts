import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Clown',
  level: 3,
  goldBounty: 10,
  gameMode: 'standard',
  stats: {
    maxHealth: 4,
    health: 4,
    attack: 8,
    defense: 4,
  },
})
