import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { Stack } from '../stack'

describe('Stack', () => {
  it('renders children', async () => {
    await render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    )

    await expect.element(page.getByText('Item 1')).toBeInTheDocument()
    await expect.element(page.getByText('Item 2')).toBeInTheDocument()
  })

  it('applies default spacing and alignment', async () => {
    await render(<Stack data-testid="stack">Content</Stack>)
    const stack = page.getByTestId('stack')

    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('stack'))
    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('left'))
    const stackElement = await stack.element()
    expect(stackElement.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('applies custom spacing', async () => {
    await render(
      <Stack spacing="500" data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')
    const stackElement = await stack.element()

    expect(stackElement.style.getPropertyValue('--gap')).toBe('var(--spacing-500)')
  })

  it('applies left alignment', async () => {
    await render(
      <Stack align="left" data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')

    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('left'))
  })

  it('applies center alignment', async () => {
    await render(
      <Stack align="center" data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')

    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('center'))
  })

  it('applies right alignment', async () => {
    await render(
      <Stack align="right" data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')

    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('right'))
  })

  it('accepts custom className', async () => {
    await render(
      <Stack className="custom-class" data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')

    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('stack'))
    await expect.element(stack).toHaveAttribute('class', expect.stringContaining('custom-class'))
  })

  it('accepts custom style prop', async () => {
    await render(
      <Stack style={{ backgroundColor: 'red' }} data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')
    const stackElement = await stack.element()

    expect(stackElement.style.backgroundColor).toBe('red')
    expect(stackElement.style.getPropertyValue('--gap')).toBe('var(--spacing-300)')
  })

  it('merges custom styles with gap style', async () => {
    await render(
      <Stack spacing="400" style={{ padding: '10px', color: 'blue' }} data-testid="stack">
        Content
      </Stack>,
    )
    const stack = page.getByTestId('stack')
    const stackElement = await stack.element()

    expect(stackElement.style.getPropertyValue('--gap')).toBe('var(--spacing-400)')
    expect(stackElement.style.padding).toBe('10px')
    expect(stackElement.style.color).toBe('blue')
  })
})
