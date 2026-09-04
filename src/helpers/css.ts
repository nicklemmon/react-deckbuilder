import { clsx, type ClassValue } from 'clsx'

type CssModule = Record<string, string | undefined>

/** Looks up a CSS module class by name, falling back to an empty string when missing. */
export function cssClass(css: CssModule, name: string): string {
  return css[name] ?? ''
}

/**
 * Builds a className string from a CSS module, mapping class names to conditions like clsx's
 * object form does. Guards each lookup against a missing class from `noUncheckedIndexedAccess`.
 */
export function cx(
  css: CssModule,
  classes: Record<string, boolean | undefined>,
  ...rest: ClassValue[]
): string {
  const conditions: Record<string, boolean> = {}

  for (const [name, condition] of Object.entries(classes)) {
    conditions[cssClass(css, name)] = condition ?? false
  }

  return clsx(conditions, ...rest)
}
