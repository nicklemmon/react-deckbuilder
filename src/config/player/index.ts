import MageImg from 'src/images/hooded-mage.png'
import { Player } from 'src/interfaces'

const player: Player = {
  characterPortrait: MageImg,
  stats: {
    maxHealth: 45,
    health: 45,
    attack: 3,
    defense: 1,
  },
  inventory: {
    gold: 0,
    items: [],
  },
}

export default player
