import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { AnimatedDeck } from '../animated-deck'

describe('AnimatedDeck', () => {
  it('renders children', async () => {
    render(
      <AnimatedDeck>
        <div>Card 1</div>
        <div>Card 2</div>
      </AnimatedDeck>,
    )

    await expect.element(page.getByText('Card 1')).toBeInTheDocument()
    await expect.element(page.getByText('Card 2')).toBeInTheDocument()
  })

  it('renders EmptyDeck when no children are provided', async () => {
    render(<AnimatedDeck />)

    const container = page.getByTestId('animated-deck-container')
    const emptyDeck = (await container.element()).querySelector('[class*="empty-deck"]')

    await expect.element(page.getByTestId('animated-deck-container')).toBeInTheDocument()
    expect(emptyDeck).toBeTruthy()
  })

  it('does not render EmptyDeck when children are present', async () => {
    render(
      <AnimatedDeck>
        <div>Card 1</div>
      </AnimatedDeck>,
    )

    const container = page.getByTestId('animated-deck-container')
    const emptyDeck = (await container.element()).querySelector('[class*="empty-deck"]')

    expect(emptyDeck).toBeNull()
  })

  it('wraps each child in an absolutely positioned element', async () => {
    render(
      <AnimatedDeck>
        <div data-testid="card-a">Card A</div>
        <div data-testid="card-b">Card B</div>
        <div data-testid="card-c">Card C</div>
      </AnimatedDeck>,
    )

    for (const testId of ['card-a', 'card-b', 'card-c']) {
      const card = await page.getByTestId(testId).element()
      const wrapper = card.parentElement as HTMLElement

      expect(wrapper.style.position).toBe('absolute')
    }
  })

  it('offsets each card by 5px per index', async () => {
    render(
      <AnimatedDeck>
        <div data-testid="card-0">Card 0</div>
        <div data-testid="card-1">Card 1</div>
        <div data-testid="card-2">Card 2</div>
      </AnimatedDeck>,
    )

    const card0Wrapper = (await page.getByTestId('card-0').element()).parentElement as HTMLElement
    const card1Wrapper = (await page.getByTestId('card-1').element()).parentElement as HTMLElement
    const card2Wrapper = (await page.getByTestId('card-2').element()).parentElement as HTMLElement

    expect(card0Wrapper.style.left).toBe('0px')
    expect(card1Wrapper.style.left).toBe('-5px')
    expect(card2Wrapper.style.left).toBe('-10px')
  })

  it('assigns ascending z-index per card', async () => {
    render(
      <AnimatedDeck>
        <div data-testid="card-0">Card 0</div>
        <div data-testid="card-1">Card 1</div>
        <div data-testid="card-2">Card 2</div>
      </AnimatedDeck>,
    )

    const card0Wrapper = (await page.getByTestId('card-0').element()).parentElement as HTMLElement
    const card1Wrapper = (await page.getByTestId('card-1').element()).parentElement as HTMLElement
    const card2Wrapper = (await page.getByTestId('card-2').element()).parentElement as HTMLElement

    expect(Number(card0Wrapper.style.zIndex)).toBe(0)
    expect(Number(card1Wrapper.style.zIndex)).toBe(1)
    expect(Number(card2Wrapper.style.zIndex)).toBe(2)
  })

  it('shows EmptyDeck after all children are removed', async () => {
    const { rerender } = await render(
      <AnimatedDeck>
        <div key="card-a">Card A</div>
      </AnimatedDeck>,
    )

    await expect.element(page.getByText('Card A')).toBeInTheDocument()

    await rerender(<AnimatedDeck />)

    const container = page.getByTestId('animated-deck-container')
    const emptyDeck = (await container.element()).querySelector('[class*="empty-deck"]')

    expect(emptyDeck).toBeTruthy()
  })

  it('hides EmptyDeck when children are added to an empty deck', async () => {
    const { rerender } = await render(<AnimatedDeck />)

    const container = page.getByTestId('animated-deck-container')
    expect((await container.element()).querySelector('[class*="empty-deck"]')).toBeTruthy()

    await rerender(
      <AnimatedDeck>
        <div key="card-a">Card A</div>
      </AnimatedDeck>,
    )

    expect((await container.element()).querySelector('[class*="empty-deck"]')).toBeNull()
  })

  it('renders all cards when multiple are added simultaneously', async () => {
    const { rerender } = await render(
      <AnimatedDeck>
        <div key="card-a">Card A</div>
      </AnimatedDeck>,
    )

    await rerender(
      <AnimatedDeck>
        <div key="card-a">Card A</div>
        <div key="card-b">Card B</div>
        <div key="card-c">Card C</div>
        <div key="card-d">Card D</div>
      </AnimatedDeck>,
    )

    await expect.element(page.getByText('Card A')).toBeInTheDocument()
    await expect.element(page.getByText('Card B')).toBeInTheDocument()
    await expect.element(page.getByText('Card C')).toBeInTheDocument()
    await expect.element(page.getByText('Card D')).toBeInTheDocument()
  })

  it('renders all cards when the full deck is populated from empty', async () => {
    const { rerender } = await render(<AnimatedDeck />)

    await rerender(
      <AnimatedDeck>
        <div key="card-a">Card A</div>
        <div key="card-b">Card B</div>
        <div key="card-c">Card C</div>
      </AnimatedDeck>,
    )

    await expect.element(page.getByText('Card A')).toBeInTheDocument()
    await expect.element(page.getByText('Card B')).toBeInTheDocument()
    await expect.element(page.getByText('Card C')).toBeInTheDocument()
  })
})
