/**
 * Helper function to return eagerly resolved modules.
 * @param modules - The return value of import.meta.glob with eager loading enabled.
 * @returns An object containing the resolved modules.
 */
export function resolveModules<T>(modules: Record<string, any>) {
  const result: Array<any> = []

  // Loop through each module entry and assign the default export to the result.
  for (const [_path, module] of Object.entries(modules)) {
    result.push(module.default || module) // Handle cases where there's no default export
  }

  return result as Array<T>
}

/**
 * Helper function to return eagerly resolved modules with their original paths.
 * Useful when you need to filter based on the original filename (e.g., for game mode suffixes).
 * @param modules - The return value of import.meta.glob with eager loading enabled.
 * @returns An array of objects containing both the original path and resolved URL.
 */
export function resolveModulesWithPaths<T = string>(modules: Record<string, any>) {
  const result: Array<{ path: string; url: T }> = []

  // Loop through each module entry and preserve both path and resolved URL
  for (const [path, module] of Object.entries(modules)) {
    result.push({
      path,
      url: (module.default || module) as T,
    })
  }

  return result
}
