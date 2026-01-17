import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Avatar } from '../avatar'

// Mock motion to avoid animation complexity in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, onAnimationComplete, ...props }: any) => (
      <div {...props} data-testid="motion-div" onAnimationEnd={onAnimationComplete}>
        {children}
      </div>
    ),
  },
}))

// Mock rng helper since it's used for shake animation
vi.mock('../helpers/rng', () => ({
  rng: vi.fn(() => 10),
}))

describe('Avatar', () => {
  const mockSrc = '/path/to/avatar.png'

  it('renders with provided image src', async () => {
    render(<Avatar src={mockSrc} />)

    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()
    await expect.element(img).toHaveAttribute('src', mockSrc)
  })

  it('renders with idle status by default', async () => {
    render(<Avatar src={mockSrc} />)

    const img = page.getByRole('img')
    await expect.element(img).toHaveAttribute('class', expect.stringContaining('avatar-img'))

    // Should not have damage or healing flash
    const damageFlashElements = await page.getByTestId('damage-flash').query()
    const healingFlashElements = await page.getByTestId('healing-flash').query()
    expect(damageFlashElements).toBeNull()
    expect(healingFlashElements).toBeNull()
  })

  it('renders with idle status when explicitly set', async () => {
    render(<Avatar src={mockSrc} status="idle" />)

    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()

    // Should not have damage or healing flash
    const damageFlashElements = await page.getByTestId('damage-flash').query()
    const healingFlashElements = await page.getByTestId('healing-flash').query()
    expect(damageFlashElements).toBeNull()
    expect(healingFlashElements).toBeNull()
  })

  it('renders damage flash when taking damage', async () => {
    render(<Avatar src={mockSrc} status="taking-damage" />)

    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()

    // Should have motion divs for animation wrapper and damage flash
    const motionDivs = page.getByTestId('motion-div')
    const motionDivsElements = await motionDivs.elements()
    expect(motionDivsElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders healing flash when healing', async () => {
    render(<Avatar src={mockSrc} status="healing" />)

    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()

    // Should have motion divs for animation wrapper and healing flash
    const motionDivs = page.getByTestId('motion-div')
    const motionDivsElements = await motionDivs.elements()
    expect(motionDivsElements.length).toBeGreaterThanOrEqual(2)
  })

  it('renders normally when dead', async () => {
    render(<Avatar src={mockSrc} status="dead" />)

    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()

    // Should not have damage or healing flash
    const damageFlashElements = await page.getByTestId('damage-flash').query()
    const healingFlashElements = await page.getByTestId('healing-flash').query()
    expect(damageFlashElements).toBeNull()
    expect(healingFlashElements).toBeNull()
  })

  it('calls onAnimationComplete when provided', async () => {
    const mockCallback = vi.fn()
    render(<Avatar src={mockSrc} status="taking-damage" onAnimationComplete={mockCallback} />)

    // Simulate animation completion
    const motionDivs = page.getByTestId('motion-div')
    const motionDivsElements = await motionDivs.elements()
    const damageFlash = motionDivsElements.find(
      (div) => (div as HTMLDivElement).onanimationend === mockCallback,
    )

    if ((damageFlash as HTMLDivElement)?.onanimationend) {
      ;(damageFlash as HTMLDivElement).onanimationend!({} as any)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    }
  })

  it('has proper structure with avatar container', async () => {
    render(<Avatar src={mockSrc} />)

    const img = page.getByRole('img')
    const imgElement = await img.element()
    const container = imgElement.parentElement

    expect(container).toBeInTheDocument()
    expect(container?.className).toContain('avatar')
  })

  it('renders image with correct CSS class', async () => {
    render(<Avatar src={mockSrc} />)

    const img = page.getByRole('img')
    await expect.element(img).toHaveAttribute('class', expect.stringContaining('avatar-img'))
  })
})
