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
