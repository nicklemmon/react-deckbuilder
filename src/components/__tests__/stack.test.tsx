import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Stack } from '../stack'

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies default spacing and alignment', () => {
    render(<Stack data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.className).toContain('stack')
    expect(stack.className).toContain('left')
    expect(stack.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('applies custom spacing', () => {
    render(<Stack spacing="500" data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.style.getPropertyValue('--gap')).toBe('var(--spacing-500)')
  })

  it('applies left alignment', () => {
    render(<Stack align="left" data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.className).toContain('left')
  })

  it('applies center alignment', () => {
    render(<Stack align="center" data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.className).toContain('center')
  })

  it('applies right alignment', () => {
    render(<Stack align="right" data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.className).toContain('right')
  })

  it('accepts custom className', () => {
    render(<Stack className="custom-class" data-testid="stack">Content</Stack>)
    const stack = screen.getByTestId('stack')
    
    expect(stack.className).toContain('stack')
    expect(stack.className).toContain('custom-class')
  })

  it('accepts custom style prop', () => {
    render(
      <Stack style={{ backgroundColor: 'red' }} data-testid="stack">
        Content
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    
    expect(stack.style.backgroundColor).toBe('red')
    expect(stack.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('merges custom styles with gap style', () => {
    render(
      <Stack 
        spacing="400" 
        style={{ padding: '10px', color: 'blue' }} 
        data-testid="stack"
      >
        Content
      </Stack>
    )
    const stack = screen.getByTestId('stack')
    
    expect(stack.style.getPropertyValue('--gap')).toBe('var(--spacing-400)')
    expect(stack.style.padding).toBe('10px')
    expect(stack.style.color).toBe('blue')
  })
})