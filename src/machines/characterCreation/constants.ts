import config from 'src/config'
import { CharacterCreationContext } from './types'

export const CHARACTER_CREATION_MACHINE_ID = 'character-creation-machine'

export const CHARACTER_CREATION_MACHINE_DEFAULT_CONTEXT: CharacterCreationContext = {
  name: '',
  characterClass: 'berzerker',
  characterPortrait: config.playerPortraits[0],
}
