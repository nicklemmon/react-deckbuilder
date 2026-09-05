export type Rng = {
  /** Returns a random integer in the range `[0, maxExclusive)`. */
  int(maxExclusive: number): number
  /** Returns one random array item. Throws when the array is empty. */
  pick<T>(xs: readonly T[]): T
  /** Returns a shuffled copy without modifying the input array. */
  shuffle<T>(xs: T[]): T[]
  /** Returns a unique identifier. */
  id(): string
}

/** Returns one item using the given random-index generator. */
function pick<T>(xs: readonly T[], randomIndex: (maxExclusive: number) => number): T {
  if (xs.length === 0) throw new Error('Cannot pick from an empty array')
  return (
    xs[randomIndex(xs.length)] ??
    (() => {
      throw new Error('Random index was out of bounds')
    })()
  )
}

/** Returns a Fisher-Yates shuffled copy using the given random-index generator. */
function shuffle<T>(xs: T[], randomIndex: (maxExclusive: number) => number): T[] {
  const arr = [...xs]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    const left = arr[i]
    const right = arr[j]
    if (left === undefined || right === undefined)
      throw new Error('Shuffle index was out of bounds')
    ;[arr[i], arr[j]] = [right, left]
  }
  return arr
}

class MathRandomRng implements Rng {
  int(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive)
  }

  pick<T>(xs: readonly T[]): T {
    return pick(xs, (maxExclusive) => this.int(maxExclusive))
  }

  shuffle<T>(xs: T[]): T[] {
    return shuffle(xs, (maxExclusive) => this.int(maxExclusive))
  }

  id(): string {
    return crypto.randomUUID()
  }
}

export class SeededRng implements Rng {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  private next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xffffffff
    return (this.seed >>> 0) / 0x100000000
  }

  int(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive)
  }

  pick<T>(xs: readonly T[]): T {
    return pick(xs, (maxExclusive) => this.int(maxExclusive))
  }

  shuffle<T>(xs: T[]): T[] {
    return shuffle(xs, (maxExclusive) => this.int(maxExclusive))
  }

  id(): string {
    const hex = (n: number) => ((n * 0x100000000) >>> 0).toString(16).padStart(8, '0')
    return `${hex(this.next())}-${hex(this.next())}-${hex(this.next())}-${hex(this.next())}`
  }
}

export const rng: Rng = new MathRandomRng()
