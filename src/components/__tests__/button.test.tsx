import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with default variant classes', () => {
    render(<Button>Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('primary')
  })

  it('renders with secondary variant classes', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('secondary')
  })

  it('renders with tertiary variant classes', () => {
    render(<Button variant="tertiary">Tertiary Button</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('tertiary')
  })

  it('renders with destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('destructive')
  })

  it('renders with unstyled variant classes', () => {
    render(<Button variant="unstyled">Unstyled Button</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('button')
    expect(button.className).toContain('unstyled')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('forwards other button props', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>)
    const button = screen.getByTestId('submit-btn')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('has proper structure with content and background elements', () => {
    render(<Button>Test Content</Button>)
    const button = screen.getByRole('button')
    
    // Check that button has 2 child elements (content span and bg span)
    expect(button.children).toHaveLength(2)
    
    // Check that content is accessible
    expect(button).toHaveTextContent('Test Content')
    
    // Check spans exist with appropriate classes
    const spans = button.querySelectorAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].className).toContain('button-content')
    expect(spans[1].className).toContain('button-bg')
  })
})