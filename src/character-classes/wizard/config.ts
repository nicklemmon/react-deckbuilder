import { defineCharacterClass } from '../../helpers/character-classes'
import { requireCard, CARDS } from '../../helpers/cards'

export default defineCharacterClass({
  id: 'wizard',
  name: 'Wizard',
  deck: [
    requireCard('shield-slam', CARDS),
    requireCard('shield-slam', CARDS),
    requireCard('lightning', CARDS),
    requireCard('earthquake', CARDS),
    requireCard('assassinate', CARDS),
  ],
})
