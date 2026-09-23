import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type { Card as CardType } from '../../types/cards'
import type { Item } from '../../types/items'
import { Card } from '../card'
import { ItemShopCard } from '../item-shop-card'
import { ItemShopItem } from '../item-shop-item'

const card = {
  id: 'test-card',
  name: 'Test Card',
  description: 'Test description',
  rarity: 0,
  price: 10,
  stats: { attack: 5 },
  sfx: { play: () => {} },
} as CardType

describe('card actions', () => {
  it('plays a hand card from the keyboard', async () => {
    const onClick = vi.fn()
    await render(<Card {...card} onClick={onClick} />)
    ;(await page.getByRole('button', { name: 'Test Card, 5 attack' }).element()).focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('buys an affordable card from the keyboard', async () => {
    const onClick = vi.fn()
    await render(<ItemShopCard {...card} shopStatus="affordable" onClick={onClick} />)
    ;(await page.getByRole('button', { name: 'Test Card, 10 gold' }).element()).focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps purchased cards inactive', async () => {
    const onClick = vi.fn()
    await render(<ItemShopCard {...card} shopStatus="purchased" onClick={onClick} />)
    const action = await page.getByRole('button', { name: 'Test Card, 10 gold' }).element()
    expect(action.getAttribute('aria-disabled')).toBe('true')
    expect(action.getAttribute('tabindex')).toBe('-1')
    action.focus()
    await userEvent.keyboard('{Enter}')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('names and disables unaffordable item buttons', async () => {
    const onClick = vi.fn()
    const item = {
      id: 'potion',
      name: 'Potion',
      artwork: '',
      cost: 10,
      value: 10,
      type: 'healing',
      sfx: { obtain: {}, use: {}, effect: {} },
    } as Item
    await render(<ItemShopItem item={item} shopStatus="unaffordable" onClick={onClick} />)
    const action = await page.getByRole('button', { name: 'Potion' }).element()
    expect((action as HTMLButtonElement).disabled).toBe(true)
  })
})
