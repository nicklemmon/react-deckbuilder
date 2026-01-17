import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { HealthBar } from '../health-bar'

describe('HealthBar', () => {
  it('renders health text correctly with full health', async () => {
    render(<HealthBar health={100} maxHealth={100} />)

    await expect.element(page.getByText('100 HP')).toBeInTheDocument()
  })

  it('renders health text correctly with partial health', async () => {
    render(<HealthBar health={75} maxHealth={100} />)

    await expect.element(page.getByText('75 HP')).toBeInTheDocument()
  })

  it('renders health text correctly with zero health', async () => {
    render(<HealthBar health={0} maxHealth={100} />)

    await expect.element(page.getByText('0 HP')).toBeInTheDocument()
  })

  it('renders health text as 0 when health is negative', async () => {
    render(<HealthBar health={-10} maxHealth={100} />)

    await expect.element(page.getByText('0 HP')).toBeInTheDocument()
  })

  it('calculates health percentage correctly for full health', async () => {
    render(<HealthBar health={100} maxHealth={100} />)

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('1')
  })

  it('calculates health percentage correctly for half health', async () => {
    render(<HealthBar health={50} maxHealth={100} />)

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0.5')
  })

  it('calculates health percentage correctly for quarter health', async () => {
    render(<HealthBar health={25} maxHealth={100} />)

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0.25')
  })

  it('calculates health percentage correctly for zero health', async () => {
    render(<HealthBar health={0} maxHealth={100} />)

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0')
  })

  it('handles different max health values correctly', async () => {
    render(<HealthBar health={60} maxHealth={200} />)

    await expect.element(page.getByText('60 HP')).toBeInTheDocument()

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0.3')
  })

  it('handles fractional health calculations', async () => {
    render(<HealthBar health={33} maxHealth={100} />)

    await expect.element(page.getByText('33 HP')).toBeInTheDocument()

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0.33')
  })

  it('has proper component structure', async () => {
    render(<HealthBar health={50} maxHealth={100} />)

    // Check for health bar container (has the CSS variable)
    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect(healthBar).toBeInTheDocument()
    expect((healthBar as HTMLElement)?.className).toContain('health-bar')

    // Check for health bar fill
    const healthBarFill = healthBar?.querySelector('div')
    expect(healthBarFill).toBeInTheDocument()
    expect(healthBarFill?.className).toContain('health-bar-fill')

    // Check for text element with HP content
    await expect.element(page.getByText('50 HP')).toBeInTheDocument()
    const textElement = await page.getByText('50 HP').element()
    expect(textElement.className).toContain('health-bar-text')
  })

  it('handles edge case with max health of 1', async () => {
    render(<HealthBar health={1} maxHealth={1} />)

    await expect.element(page.getByText('1 HP')).toBeInTheDocument()

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('1')
  })

  it('handles edge case with very high health values', async () => {
    render(<HealthBar health={9999} maxHealth={10000} />)

    await expect.element(page.getByText('9999 HP')).toBeInTheDocument()

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('0.9999')
  })

  it('handles negative health with proper percentage calculation', async () => {
    render(<HealthBar health={-50} maxHealth={100} />)

    // Text should show 0 but percentage calculation uses actual negative value
    await expect.element(page.getByText('0 HP')).toBeInTheDocument()

    const healthBar = document.querySelector('[style*="--health-percentage"]')
    expect((healthBar as HTMLElement)?.style.getPropertyValue('--health-percentage')).toBe('-0.5')
  })
})
