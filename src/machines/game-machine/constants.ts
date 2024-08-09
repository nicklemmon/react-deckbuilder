import { resolveModules } from '../../helpers/vite'
import type { Monster } from '../../types/monsters'

/** All monster config files in the project */
const MONSTER_MODULES = import.meta.glob('../../monsters/**/config/ts', {
  eager: true,
})

export const MONSTERS = resolveModules<Monster>(MONSTER_MODULES)
