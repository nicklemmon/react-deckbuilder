import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Inline } from '../inline'

describe('Inline', () => {
  it('renders children', () => {
    render(
      <Inline>
        <span>Item 1</span>
        <span>Item 2</span>
      </Inline>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies default spacing and alignment', () => {
    render(<Inline data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.className).toContain('inline')
    expect(inline.className).toContain('center')
    expect(inline.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('applies custom spacing', () => {
    render(<Inline spacing="100" data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.style.getPropertyValue('--gap')).toBe('var(--spacing-100)')
  })

  it('applies top alignment', () => {
    render(<Inline align="top" data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.className).toContain('top')
  })

  it('applies center alignment', () => {
    render(<Inline align="center" data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.className).toContain('center')
  })

  it('applies bottom alignment', () => {
    render(<Inline align="bottom" data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.className).toContain('bottom')
  })

  it('accepts custom className', () => {
    render(<Inline className="flex-row" data-testid="inline">Content</Inline>)
    const inline = screen.getByTestId('inline')
    
    expect(inline.className).toContain('inline')
    expect(inline.className).toContain('flex-row')
  })

  it('works with different spacing values', () => {
    const spacingValues = ['100', '200', '300', '400', '500'] as const
    
    spacingValues.forEach((spacing) => {
      const { unmount } = render(
        <Inline spacing={spacing} data-testid={`inline-${spacing}`}>
          Content
        </Inline>
      )
      
      const inline = screen.getByTestId(`inline-${spacing}`)
      expect(inline.style.getPropertyValue('--gap')).toBe(`var(--spacing-${spacing})`)
      
      unmount()
    })
  })

  it('handles alignment logic correctly', () => {
    // Test the ternary logic for alignment classes
    const alignments = [
      { align: 'top' as const, expectedClass: 'top' },
      { align: 'bottom' as const, expectedClass: 'bottom' },
      { align: 'center' as const, expectedClass: 'center' },
    ]

    alignments.forEach(({ align, expectedClass }) => {
      const { unmount } = render(
        <Inline align={align} data-testid={`inline-${align}`}>
          Content
        </Inline>
      )
      
      const inline = screen.getByTestId(`inline-${align}`)
      expect(inline.className).toContain(expectedClass)
      
      unmount()
    })
  })
})