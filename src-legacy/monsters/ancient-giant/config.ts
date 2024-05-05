import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Ancient Giant',
  level: 7,
  goldBounty: 10,
  stats: {
    maxHealth: 15,
    health: 15,
    attack: 4,
    defense: 5,
  },
})
