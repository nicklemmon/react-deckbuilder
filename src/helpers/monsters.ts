import type { Monster } from '../types/monsters'

export function defineMonster(config: Omit<Monster, 'id' | 'artwork' | 'sfx'>) {
  return config
}
