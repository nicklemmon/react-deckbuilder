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
