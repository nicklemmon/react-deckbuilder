import { defineCharacterClass } from '../../helpers/character-classes'
import { getCard, CARDS } from '../../helpers/cards'

export default defineCharacterClass({
  id: 'rogue',
  name: 'Rogue',
  deck: [
    getCard('shield-slam', CARDS),
    getCard('shield-slam', CARDS),
    getCard('lightning', CARDS),
    getCard('earthquake', CARDS),
    getCard('assassinate', CARDS),
  ].filter(Boolean),
})
