import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with children', async () => {
    render(<Button>Click me</Button>)
    await expect.element(page.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders with default variant classes', async () => {
    render(<Button>Primary Button</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('button'))
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('primary'))
  })

  it('renders with secondary variant classes', async () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('button'))
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('secondary'))
  })

  it('renders with tertiary variant classes', async () => {
    render(<Button variant="tertiary">Tertiary Button</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('button'))
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('tertiary'))
  })

  it('renders with destructive variant classes', async () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('button'))
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('destructive'))
  })

  it('renders with unstyled variant classes', async () => {
    render(<Button variant="unstyled">Unstyled Button</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('button'))
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('unstyled'))
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(page.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', async () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = page.getByRole('button')
    await expect.element(button).toBeDisabled()
  })

  it('forwards other button props', async () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>,
    )
    const button = page.getByTestId('submit-btn')
    await expect.element(button).toHaveAttribute('type', 'submit')
  })

  it('has proper structure with content and background elements', async () => {
    render(<Button>Test Content</Button>)
    const button = page.getByRole('button')

    // Check that button has 2 child elements (content span and bg span)
    const buttonElement = await button.element()
    expect(buttonElement.children).toHaveLength(2)

    // Check that content is accessible
    await expect.element(button).toHaveTextContent('Test Content')

    // Check spans exist with appropriate classes
    const spans = buttonElement.querySelectorAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].className).toContain('button-content')
    expect(spans[1].className).toContain('button-bg')
  })

  it('applies custom className only to button element, not child elements', async () => {
    render(<Button className="custom-class">Test</Button>)
    const button = page.getByRole('button')
    const buttonElement = await button.element()
    const spans = buttonElement.querySelectorAll('span')

    // Button element should have the custom class
    await expect.element(button).toHaveAttribute('class', expect.stringContaining('custom-class'))

    // Child spans should NOT have the custom class
    expect(spans[0].className).not.toContain('custom-class')
    expect(spans[1].className).not.toContain('custom-class')

    // But child spans should still have their base classes
    expect(spans[0].className).toContain('button-content')
    expect(spans[1].className).toContain('button-bg')
  })
})
