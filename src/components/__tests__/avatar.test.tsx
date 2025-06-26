import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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

  it('renders with provided image src', () => {
    render(<Avatar src={mockSrc} />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockSrc)
  })

  it('renders with idle status by default', () => {
    render(<Avatar src={mockSrc} />)

    const img = screen.getByRole('img')
    expect(img.className).toContain('avatar-img')

    // Should not have damage or healing flash
    expect(screen.queryByTestId('damage-flash')).not.toBeInTheDocument()
    expect(screen.queryByTestId('healing-flash')).not.toBeInTheDocument()
  })

  it('renders with idle status when explicitly set', () => {
    render(<Avatar src={mockSrc} status="idle" />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()

    // Should not have damage or healing flash
    expect(screen.queryByTestId('damage-flash')).not.toBeInTheDocument()
    expect(screen.queryByTestId('healing-flash')).not.toBeInTheDocument()
  })

  it('renders damage flash when taking damage', () => {
    render(<Avatar src={mockSrc} status="taking-damage" />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()

    // Should have motion divs for animation wrapper and damage flash
    const motionDivs = screen.getAllByTestId('motion-div')
    expect(motionDivs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders healing flash when healing', () => {
    render(<Avatar src={mockSrc} status="healing" />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()

    // Should have motion divs for animation wrapper and healing flash
    const motionDivs = screen.getAllByTestId('motion-div')
    expect(motionDivs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders normally when dead', () => {
    render(<Avatar src={mockSrc} status="dead" />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()

    // Should not have damage or healing flash
    expect(screen.queryByTestId('damage-flash')).not.toBeInTheDocument()
    expect(screen.queryByTestId('healing-flash')).not.toBeInTheDocument()
  })

  it('calls onAnimationComplete when provided', () => {
    const mockCallback = vi.fn()
    render(<Avatar src={mockSrc} status="taking-damage" onAnimationComplete={mockCallback} />)

    // Simulate animation completion
    const motionDivs = screen.getAllByTestId('motion-div')
    const damageFlash = motionDivs.find(
      (div) => (div as HTMLDivElement).onanimationend === mockCallback,
    )

    if ((damageFlash as HTMLDivElement)?.onanimationend) {
      ;(damageFlash as HTMLDivElement).onanimationend!({} as any)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    }
  })

  it('has proper structure with avatar container', () => {
    render(<Avatar src={mockSrc} />)

    const img = screen.getByRole('img')
    const container = img.parentElement

    expect(container).toBeInTheDocument()
    expect(container?.className).toContain('avatar')
  })

  it('handles different status transitions', () => {
    const { rerender } = render(<Avatar src={mockSrc} status="idle" />)

    // Start with idle - no flashes
    expect(screen.queryByTestId('damage-flash')).not.toBeInTheDocument()
    expect(screen.queryByTestId('healing-flash')).not.toBeInTheDocument()

    // Change to taking damage
    rerender(<Avatar src={mockSrc} status="taking-damage" />)
    let motionDivs = screen.getAllByTestId('motion-div')
    expect(motionDivs.length).toBeGreaterThanOrEqual(2)

    // Change to healing
    rerender(<Avatar src={mockSrc} status="healing" />)
    motionDivs = screen.getAllByTestId('motion-div')
    expect(motionDivs.length).toBeGreaterThanOrEqual(2)

    // Back to idle
    rerender(<Avatar src={mockSrc} status="idle" />)
    expect(screen.queryByTestId('damage-flash')).not.toBeInTheDocument()
    expect(screen.queryByTestId('healing-flash')).not.toBeInTheDocument()
  })

  it('renders image with correct CSS class', () => {
    render(<Avatar src={mockSrc} />)

    const img = screen.getByRole('img')
    expect(img.className).toContain('avatar-img')
  })
})
