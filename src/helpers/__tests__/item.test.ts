import { describe, expect, it } from 'vitest'
import { getAllItems, requireItem } from '../item'

describe('getAllItems', () => {
  it('discovers the small potion required by the item shop', () => {
    expect(requireItem('small-potion', getAllItems())).toMatchObject({ id: 'small-potion' })
  })
})
