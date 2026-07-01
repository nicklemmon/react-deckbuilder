import { describe, it, expect } from 'vitest'
import { SeededRng } from '../rng'

describe('SeededRng', () => {
  it('produces the same sequence when initialized with the same seed', () => {
    const r1 = new SeededRng(42)
    const r2 = new SeededRng(42)
    for (let i = 0; i < 10; i++) {
      expect(r1.int(100)).toBe(r2.int(100))
    }
  })

  it('int returns values in [0, maxExclusive)', () => {
    const r = new SeededRng(12345)
    for (let i = 0; i < 200; i++) {
      const val = r.int(10)
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThan(10)
    }
  })

  it('int never returns maxExclusive', () => {
    const r = new SeededRng(99)
    for (let i = 0; i < 1000; i++) {
      expect(r.int(5)).toBeLessThan(5)
    }
  })

  it('shuffle returns same permutation for same seed', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(new SeededRng(7).shuffle(arr)).toEqual(new SeededRng(7).shuffle(arr))
  })

  it('shuffle does not mutate the input array', () => {
    const arr = [1, 2, 3]
    new SeededRng(7).shuffle(arr)
    expect(arr).toEqual([1, 2, 3])
  })

  it('id returns same value for same seed', () => {
    expect(new SeededRng(123).id()).toBe(new SeededRng(123).id())
  })
})
