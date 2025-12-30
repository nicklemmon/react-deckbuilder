import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Creepy',
  level: 5,
  goldBounty: 15,
  gameMode: 'standard',
  stats: {
    maxHealth: 6,
    health: 6,
    attack: 12,
    defense: 3,
  },
})
