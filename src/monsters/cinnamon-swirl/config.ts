import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Cinnamon Swirl',
  level: 4,
  goldBounty: 6,
  gameMode: 'rainbow',
  stats: {
    maxHealth: 10,
    health: 10,
    attack: 5,
    defense: 2,
  },
})
