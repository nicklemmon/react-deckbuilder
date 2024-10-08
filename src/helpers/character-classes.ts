import type { CharacterClass } from '../types/character-classes'

/** Definition helper for character classes */
export function defineCharacterClass(config: CharacterClass) {
  return config
}

/** Returns a character class from an array of character classes by its id */
export function getCharacterClass(id: string, characterClasses: Array<CharacterClass>) {
  return [...characterClasses].find((characterClass) => characterClass.id === id) as CharacterClass
}
