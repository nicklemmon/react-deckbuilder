/** Determines whether an array is empty */
export function isEmpty(arr: Array<any> | null | undefined) {
  if (!arr) return true

  if (arr.length === 0) return true

  return false
}
