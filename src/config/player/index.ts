import mageImg from 'src/images/hooded-mage.png'
import Player from 'src/interfaces/Player'

const player: Player = {
  name: 'Billie Jean',
  level: 3,
  artwork: mageImg,
  stats: {
    maxHealth: 45,
    health: 45,
    attack: 3,
    defense: 1,
  },
  inventory: {
    gold: 0,
  },
}

export default player
