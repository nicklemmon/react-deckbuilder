import { Machine } from 'xstate'
import {
  CHARACTER_CREATION_MACHINE_ID,
  CHARACTER_CREATION_MACHINE_DEFAULT_CONTEXT,
} from './constants'
import {
  CharacterCreationStateSchema,
  CharacterCreationEvent,
  CharacterCreationContext,
} from './types'
import { setName, setCharacterClass, setCharacterPortrait } from './actions'

export const CharacterCreationMachine = Machine<
  CharacterCreationContext,
  CharacterCreationStateSchema,
  CharacterCreationEvent
>({
  id: CHARACTER_CREATION_MACHINE_ID,
  initial: 'editing',
  context: CHARACTER_CREATION_MACHINE_DEFAULT_CONTEXT,
  states: {
    editing: {
      on: {
        NAME_CHANGE: {
          actions: setName,
          target: 'editing',
        },
        CHARACTER_CLASS_CHANGE: {
          actions: setCharacterClass,
          target: 'editing',
        },
        CHARACTER_PORTRAIT_CHANGE: {
          actions: setCharacterPortrait,
          target: 'editing',
        },
        SUBMIT_FORM: {
          target: 'submitted',
        },
      },
    },
    submitted: {
      type: 'final',
      data: {
        player: (context: CharacterCreationContext) => ({
          name: context.name,
          characterClass: context.characterClass,
          characterPortrait: context.characterPortrait,
        }),
      },
    },
  },
})
