import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HealthBar } from '../health-bar'

describe('HealthBar', () => {
  it('renders health text correctly with full health', () => {
    render(<HealthBar health={100} maxHealth={100} />)

    expect(screen.getByText('100 HP')).toBeInTheDocument()
  })

  it('renders health text correctly with partial health', () => {
    render(<HealthBar health={75} maxHealth={100} />)

    expect(screen.getByText('75 HP')).toBeInTheDocument()
  })

  it('renders health text correctly with zero health', () => {
    render(<HealthBar health={0} maxHealth={100} />)

    expect(screen.getByText('0 HP')).toBeInTheDocument()
  })

  it('renders health text as 0 when health is negative', () => {
    render(<HealthBar health={-10} maxHealth={100} />)

    expect(screen.getByText('0 HP')).toBeInTheDocument()
  })

  it('calculates health percentage correctly for full health', () => {
    const { container } = render(<HealthBar health={100} maxHealth={100} />)

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('1')
  })

  it('calculates health percentage correctly for half health', () => {
    const { container } = render(<HealthBar health={50} maxHealth={100} />)

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0.5')
  })

  it('calculates health percentage correctly for quarter health', () => {
    const { container } = render(<HealthBar health={25} maxHealth={100} />)

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0.25')
  })

  it('calculates health percentage correctly for zero health', () => {
    const { container } = render(<HealthBar health={0} maxHealth={100} />)

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0')
  })

  it('handles different max health values correctly', () => {
    const { container } = render(<HealthBar health={60} maxHealth={200} />)

    expect(screen.getByText('60 HP')).toBeInTheDocument()

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0.3')
  })

  it('handles fractional health calculations', () => {
    const { container } = render(<HealthBar health={33} maxHealth={100} />)

    expect(screen.getByText('33 HP')).toBeInTheDocument()

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0.33')
  })

  it('has proper component structure', () => {
    const { container } = render(<HealthBar health={50} maxHealth={100} />)

    // Check for wrapper (outermost div)
    const wrapper = container.firstChild
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.className).toContain('health-bar-wrapper')

    // Check for health bar container (has the CSS variable)
    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar).toBeInTheDocument()
    expect(healthBar?.className).toContain('health-bar')

    // Check for health bar fill
    const healthBarFill = healthBar?.querySelector('div')
    expect(healthBarFill).toBeInTheDocument()
    expect(healthBarFill?.className).toContain('health-bar-fill')

    // Check for text element with HP content
    expect(screen.getByText('50 HP')).toBeInTheDocument()
    const textElement = screen.getByText('50 HP')
    expect(textElement.className).toContain('health-bar-text')
  })

  it('handles edge case with max health of 1', () => {
    const { container } = render(<HealthBar health={1} maxHealth={1} />)

    expect(screen.getByText('1 HP')).toBeInTheDocument()

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('1')
  })

  it('handles edge case with very high health values', () => {
    const { container } = render(<HealthBar health={9999} maxHealth={10000} />)

    expect(screen.getByText('9999 HP')).toBeInTheDocument()

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('0.9999')
  })

  it('handles negative health with proper percentage calculation', () => {
    const { container } = render(<HealthBar health={-50} maxHealth={100} />)

    // Text should show 0 but percentage calculation uses actual negative value
    expect(screen.getByText('0 HP')).toBeInTheDocument()

    const healthBar = container.querySelector('[style*="--health-percentage"]')
    expect(healthBar?.style.getPropertyValue('--health-percentage')).toBe('-0.5')
  })
})
