import { assign, ActionObject } from 'xstate'
import { CharacterCreationContext } from './types'

export const setName: ActionObject<
  CharacterCreationContext,
  { type: 'NAME_CHANGE'; name: string }
> = assign((_context, event) => {
  const newName = event.name

  return {
    name: newName,
  }
})

export const setCharacterClass: ActionObject<
  CharacterCreationContext,
  { type: 'CHARACTER_CLASS_CHANGE'; characterClass: string }
> = assign((_context, event) => {
  const newCharacterClass = event.characterClass

  return {
    characterClass: newCharacterClass,
  }
})

export const setCharacterPortrait: ActionObject<
  CharacterCreationContext,
  { type: 'CHARACTER_PORTRAIT_CHANGE'; characterPortrait: string }
> = assign((_context, event) => {
  const newCharacterPortrait = event.characterPortrait

  return {
    characterPortrait: newCharacterPortrait,
  }
})
