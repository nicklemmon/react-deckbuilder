import type { Card } from './cards'

/** Types for a character class */
export type CharacterClass = {
  id: string
  name: string
  deck: Array<Card>
}
