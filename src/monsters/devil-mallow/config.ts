import { defineMonster } from '../../helpers/monsters'

export default defineMonster({
  name: 'Devil-Mallow',
  level: 3,
  goldBounty: 10,
  gameMode: 'rainbow',
  stats: {
    maxHealth: 25,
    health: 25,
    attack: 4,
    defense: 3,
  },
})
