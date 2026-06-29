export type Rng = {
  int(maxExclusive: number): number
  shuffle<T>(xs: T[]): T[]
  id(): string
}

export class MathRandomRng implements Rng {
  int(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive)
  }

  shuffle<T>(xs: T[]): T[] {
    const arr = [...xs]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
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

  shuffle<T>(xs: T[]): T[] {
    const arr = [...xs]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  id(): string {
    const hex = (n: number) => ((n * 0x100000000) >>> 0).toString(16).padStart(8, '0')
    return `${hex(this.next())}-${hex(this.next())}-${hex(this.next())}-${hex(this.next())}`
  }
}

export const rng: Rng = new MathRandomRng()
