import { defineCharacterClass } from '../../helpers/character-classes'
import { requireCard, CARDS } from '../../helpers/cards'

export default defineCharacterClass({
  id: 'berzerker',
  name: 'Berzerker',
  deck: [
    requireCard('shield-slam', CARDS),
    requireCard('shield-slam', CARDS),
    requireCard('shield-slam', CARDS),
    requireCard('lightning', CARDS),
    requireCard('lightning', CARDS),
    requireCard('assassinate', CARDS),
    requireCard('earthquake', CARDS),
  ],
})
