import { defineCharacterClass } from '../../helpers/character-classes'
import { getCard, CARDS } from '../../helpers/cards'

export default defineCharacterClass({
  id: 'berzerker',
  name: 'Berzerker',
  deck: [
    getCard('shield-slam', CARDS),
    getCard('shield-slam', CARDS),
    getCard('shield-slam', CARDS),
    getCard('lightning', CARDS),
    getCard('lightning', CARDS),
    getCard('assassinate', CARDS),
    getCard('earthquake', CARDS),
  ].filter(Boolean),
})
