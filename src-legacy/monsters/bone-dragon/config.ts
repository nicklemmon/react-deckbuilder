import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Bone Dragon',
  level: 8,
  goldBounty: 10,
  stats: {
    maxHealth: 20,
    health: 20,
    attack: 8,
    defense: 8,
  },
})
