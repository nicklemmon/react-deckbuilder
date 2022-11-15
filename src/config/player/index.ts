import Mage1Img from 'src/images/player-portraits/mage-1.png'
import { Player } from 'src/interfaces'

const player: Player = {
  characterPortrait: Mage1Img,
  stats: {
    maxHealth: 45,
    health: 45,
    attack: 3,
    defense: 1,
  },
  inventory: {
    gold: 50,
    items: [],
  },
}

export default player
