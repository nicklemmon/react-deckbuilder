import { Machine, assign, ActionObject } from 'xstate'
import config from 'src/config'

export const CHARACTER_CREATION_MACHINE_ID = 'character-creation-machine'

export interface CharacterCreationStateSchema {
  states: {
    editing: {}
    submitted: {}
  }
}

export type CharacterClass = 'berzerker' | 'cleric' | 'archer'

export type CharacterCreationEvent =
  | { type: 'NAME_CHANGE'; name: string }
  | { type: 'CHARACTER_CLASS_CHANGE'; characterClass: string }
  | { type: 'CHARACTER_PORTRAIT_CHANGE'; characterPortrait: string }
  | { type: 'SUBMIT_FORM' }

export interface CharacterCreationContext {
  name: string
  characterClass: string
  characterPortrait: string
}

const setName: ActionObject<
  CharacterCreationContext,
  { type: 'NAME_CHANGE'; name: string }
> = assign((_context, event) => {
  const newName = event.name

  return {
    name: newName,
  }
})

const setCharacterClass: ActionObject<
  CharacterCreationContext,
  { type: 'CHARACTER_CLASS_CHANGE'; characterClass: string }
> = assign((_context, event) => {
  const newCharacterClass = event.characterClass

  return {
    characterClass: newCharacterClass,
  }
})

const setCharacterPortrait: ActionObject<
  CharacterCreationContext,
  { type: 'CHARACTER_PORTRAIT_CHANGE'; characterPortrait: string }
> = assign((_context, event) => {
  const newCharacterPortrait = event.characterPortrait

  return {
    characterPortrait: newCharacterPortrait,
  }
})

export const CharacterCreationMachine = Machine<
  CharacterCreationContext,
  CharacterCreationStateSchema,
  CharacterCreationEvent
>({
  id: CHARACTER_CREATION_MACHINE_ID,
  initial: 'editing',
  context: {
    name: '',
    characterClass: 'berzerker',
    characterPortrait: config.playerPortraits[0],
  },
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
