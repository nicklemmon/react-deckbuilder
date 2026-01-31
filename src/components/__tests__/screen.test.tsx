import { page } from 'vitest/browser'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Screen } from '../screen'

vi.mock('howler', () => ({
  Howler: {
    volume: vi.fn(),
  },
}))

describe('Screen', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    localStorageMock = {}

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      }),
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })
  it('renders children', async () => {
    render(
      <Screen>
        <div>Screen content</div>
      </Screen>,
    )

    await expect.element(page.getByText('Screen content')).toBeInTheDocument()
  })

  it('applies screen class', async () => {
    render(<Screen data-testid="screen">Content</Screen>)

    const screenElement = page.getByTestId('screen')

    await expect.element(screenElement).toHaveAttribute('class', expect.stringContaining('screen'))
  })

  it('accepts custom className', async () => {
    render(
      <Screen className="custom-screen" data-testid="screen">
        Content
      </Screen>,
    )
    const screenElement = page.getByTestId('screen')

    await expect.element(screenElement).toHaveAttribute('class', expect.stringContaining('screen'))
    await expect
      .element(screenElement)
      .toHaveAttribute('class', expect.stringContaining('custom-screen'))
  })

  it('renders as a div element', async () => {
    render(<Screen data-testid="screen">Content</Screen>)

    const screenElement = page.getByTestId('screen')

    expect((await screenElement.element()).tagName).toBe('DIV')
  })

  it('renders multiple children', async () => {
    render(
      <Screen>
        <h1>Title</h1>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </Screen>,
    )

    await expect.element(page.getByText('Title')).toBeInTheDocument()
    await expect.element(page.getByText('Paragraph 1')).toBeInTheDocument()
    await expect.element(page.getByText('Paragraph 2')).toBeInTheDocument()
  })

  it('renders with nested components', async () => {
    render(
      <Screen data-testid="screen">
        <div>
          <h1>Nested Title</h1>
          <div>
            <p>Deeply nested content</p>
          </div>
        </div>
      </Screen>,
    )

    await expect.element(page.getByTestId('screen')).toBeInTheDocument()
    await expect.element(page.getByText('Nested Title')).toBeInTheDocument()
    await expect.element(page.getByText('Deeply nested content')).toBeInTheDocument()
  })

  it('handles className merging', async () => {
    render(
      <Screen className="custom-class-1 custom-class-2" data-testid="screen">
        Content
      </Screen>,
    )
    const screenElement = page.getByTestId('screen')

    await expect.element(screenElement).toHaveAttribute('class', expect.stringContaining('screen'))
    await expect
      .element(screenElement)
      .toHaveAttribute('class', expect.stringContaining('custom-class-1'))
    await expect
      .element(screenElement)
      .toHaveAttribute('class', expect.stringContaining('custom-class-2'))
  })

  it('renders without className prop', async () => {
    render(<Screen data-testid="screen">Content</Screen>)
    const screenElement = page.getByTestId('screen')

    await expect.element(screenElement).toHaveAttribute('class', expect.stringContaining('screen'))
    const element = await screenElement.element()
    expect(element.className.split(' ')).toHaveLength(1)
  })

  it('includes volume control', async () => {
    render(
      <Screen>
        <div>Screen content</div>
      </Screen>,
    )

    const volumeSlider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(volumeSlider).toBeInTheDocument()
  })

  it('renders volume control before children', async () => {
    render(
      <Screen data-testid="screen">
        <div data-testid="child-content">Child content</div>
      </Screen>,
    )

    const screenElement = await page.getByTestId('screen').element()
    const volumeControl = screenElement.querySelector('[class*="volume-control"]')
    const childContent = await page.getByTestId('child-content').element()

    expect(volumeControl).toBeTruthy()
    expect(childContent).toBeTruthy()

    // Volume control should come before child content in DOM order
    const volumeControlIndex = Array.from(screenElement.children).indexOf(
      volumeControl?.parentElement || volumeControl!,
    )
    const childContentIndex = Array.from(screenElement.children).indexOf(childContent)

    expect(volumeControlIndex).toBeLessThan(childContentIndex)
  })
})
