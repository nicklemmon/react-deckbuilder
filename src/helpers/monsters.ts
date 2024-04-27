import type { Monster } from '../interfaces'

export function defineMonster(config: Omit<Monster, 'id' | 'artwork' | 'sfx'>) {
  return config
}
