import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Inline } from '../inline'

describe('Inline', () => {
  it('renders children', async () => {
    render(
      <Inline>
        <span>Item 1</span>
        <span>Item 2</span>
      </Inline>,
    )

    await expect.element(page.getByText('Item 1')).toBeInTheDocument()
    await expect.element(page.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies default spacing and alignment', async () => {
    render(<Inline data-testid="inline">Content</Inline>)
    const inline = page.getByTestId('inline')

    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('inline'))
    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('center'))
    const inlineElement = await inline.element()
    expect(inlineElement.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('applies custom spacing', async () => {
    render(
      <Inline spacing="100" data-testid="inline">
        Content
      </Inline>,
    )
    const inline = page.getByTestId('inline')
    const inlineElement = await inline.element()

    expect(inlineElement.style.getPropertyValue('--gap')).toBe('var(--spacing-100)')
  })

  it('applies top alignment', async () => {
    render(
      <Inline align="top" data-testid="inline">
        Content
      </Inline>,
    )
    const inline = page.getByTestId('inline')

    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('top'))
  })

  it('applies center alignment', async () => {
    render(
      <Inline align="center" data-testid="inline">
        Content
      </Inline>,
    )
    const inline = page.getByTestId('inline')

    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('center'))
  })

  it('applies bottom alignment', async () => {
    render(
      <Inline align="bottom" data-testid="inline">
        Content
      </Inline>,
    )
    const inline = page.getByTestId('inline')

    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('bottom'))
  })

  it('accepts custom className', async () => {
    render(
      <Inline className="flex-row" data-testid="inline">
        Content
      </Inline>,
    )
    const inline = page.getByTestId('inline')

    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('inline'))
    await expect.element(inline).toHaveAttribute('class', expect.stringContaining('flex-row'))
  })

  it('works with different spacing values', async () => {
    const spacingValues = ['100', '200', '300', '400', '500'] as const

    for (const spacing of spacingValues) {
      render(
        <Inline spacing={spacing} data-testid={`inline-${spacing}`}>
          Content
        </Inline>,
      )

      const inline = page.getByTestId(`inline-${spacing}`)
      const inlineElement = await inline.element()
      expect(inlineElement.style.getPropertyValue('--gap')).toBe(`var(--spacing-${spacing})`)
    }
  })

  it('handles alignment logic correctly', async () => {
    // Test the ternary logic for alignment classes
    const alignments = [
      { align: 'top' as const, expectedClass: 'top' },
      { align: 'bottom' as const, expectedClass: 'bottom' },
      { align: 'center' as const, expectedClass: 'center' },
    ]

    for (const { align, expectedClass } of alignments) {
      render(
        <Inline align={align} data-testid={`inline-${align}`}>
          Content
        </Inline>,
      )

      const inline = page.getByTestId(`inline-${align}`)
      await expect.element(inline).toHaveAttribute('class', expect.stringContaining(expectedClass))
    }
  })
})
