import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Evil Sorcerer',
  level: 5,
  goldBounty: 9,
  stats: {
    maxHealth: 8,
    health: 8,
    attack: 9,
    defense: 1,
  },
})
