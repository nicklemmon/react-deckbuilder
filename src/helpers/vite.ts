/**
 * Helper function to return eagerly resolved modules.
 * @param modules - The return value of import.meta.glob with eager loading enabled.
 * @returns An object containing the resolved modules.
 */
type ModuleWithDefault<T> = { default: T }

export function resolveModules<T>(modules: Record<string, ModuleWithDefault<T>>): T[] {
  return Object.values(modules).map((module) => module.default)
}

/**
 * Helper function to return eagerly resolved modules with their original paths.
 * Useful when you need to filter based on the original filename (e.g., for game mode suffixes).
 * @param modules - The return value of import.meta.glob with eager loading enabled.
 * @returns An array of objects containing both the original path and resolved URL.
 */
export function resolveModulesWithPaths<T>(modules: Record<string, ModuleWithDefault<T>>) {
  return Object.entries(modules).map(([path, module]) => ({ path, url: module.default }))
}
