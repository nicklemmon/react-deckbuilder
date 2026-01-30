import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Howler } from 'howler'
import { VolumeControl } from '../volume-control'

vi.mock('howler', () => ({
  Howler: {
    volume: vi.fn(),
  },
}))

describe('VolumeControl', () => {
  const VOLUME_STORAGE_KEY = 'game-volume'
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    localStorageMock = {}

    // Mock localStorage
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

  it('renders with default volume when no stored value exists', async () => {
    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(slider).toBeInTheDocument()
    await expect.element(slider).toHaveValue('0.7')
  })

  it('renders with stored volume from localStorage', async () => {
    localStorageMock[VOLUME_STORAGE_KEY] = '0.5'

    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(slider).toHaveValue('0.5')
  })

  it('clamps stored volume to valid range (0-1)', async () => {
    localStorageMock[VOLUME_STORAGE_KEY] = '1.5'

    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(slider).toHaveValue('1')
  })

  it('uses default volume when stored value is invalid', async () => {
    localStorageMock[VOLUME_STORAGE_KEY] = 'invalid'

    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(slider).toHaveValue('0.7')
  })

  it('sets Howler volume on mount', async () => {
    localStorageMock[VOLUME_STORAGE_KEY] = '0.8'

    render(<VolumeControl />)

    expect(Howler.volume).toHaveBeenCalledWith(0.8)
  })

  it('displays correct volume percentage', async () => {
    localStorageMock[VOLUME_STORAGE_KEY] = '0.7'

    render(<VolumeControl />)

    const percentageLabel = page.getByText('70%')
    await expect.element(percentageLabel).toBeInTheDocument()
  })

  it('updates volume when slider changes', async () => {
    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })

    // Use userEvent to interact with the slider
    await userEvent.fill(slider, '0.5')

    await expect.element(slider).toHaveValue('0.5')
  })

  it('updates Howler volume when slider changes', async () => {
    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })

    vi.clearAllMocks()

    await userEvent.fill(slider, '0.3')

    // Volume should be updated
    expect(Howler.volume).toHaveBeenCalledWith(0.3)
  })

  it('persists volume to localStorage when slider changes', async () => {
    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })

    await userEvent.fill(slider, '0.6')

    expect(localStorage.setItem).toHaveBeenCalledWith(VOLUME_STORAGE_KEY, '0.6')
  })

  it('has correct slider attributes', async () => {
    render(<VolumeControl />)

    const slider = page.getByRole('slider', { name: 'Volume control' })
    await expect.element(slider).toHaveAttribute('type', 'range')
    await expect.element(slider).toHaveAttribute('min', '0')
    await expect.element(slider).toHaveAttribute('max', '1')
    await expect.element(slider).toHaveAttribute('step', '0.05')
  })

  describe('VolumeIcon', () => {
    it('renders muted icon when volume is 0', async () => {
      localStorageMock[VOLUME_STORAGE_KEY] = '0'

      render(<VolumeControl />)

      // Get the volume control element and query the SVG
      const slider = page.getByRole('slider', { name: 'Volume control' })
      const sliderElement = await slider.element()
      const volumeControl = sliderElement.closest('[class*="volume-control"]')
      const svg = volumeControl?.querySelector('svg')

      expect(svg).toBeTruthy()
      const lines = svg?.querySelectorAll('line')
      expect(lines?.length).toBe(2) // Muted icon has 2 lines for the X
    })

    it('renders low volume icon when volume is less than 0.5', async () => {
      localStorageMock[VOLUME_STORAGE_KEY] = '0.3'

      render(<VolumeControl />)

      const slider = page.getByRole('slider', { name: 'Volume control' })
      const sliderElement = await slider.element()
      const volumeControl = sliderElement.closest('[class*="volume-control"]')
      const svg = volumeControl?.querySelector('svg')

      expect(svg).toBeTruthy()
      const paths = svg?.querySelectorAll('path')
      expect(paths?.length).toBe(1) // Low icon has 1 sound wave
    })

    it('renders high volume icon when volume is 0.5 or greater', async () => {
      localStorageMock[VOLUME_STORAGE_KEY] = '0.8'

      render(<VolumeControl />)

      const slider = page.getByRole('slider', { name: 'Volume control' })
      const sliderElement = await slider.element()
      const volumeControl = sliderElement.closest('[class*="volume-control"]')
      const svg = volumeControl?.querySelector('svg')

      expect(svg).toBeTruthy()
      const paths = svg?.querySelectorAll('path')
      expect(paths?.length).toBe(2) // High icon has 2 sound waves
    })
  })

  describe('Slider fill width', () => {
    it('sets slider fill width based on volume percentage', async () => {
      localStorageMock[VOLUME_STORAGE_KEY] = '0.75'

      render(<VolumeControl />)

      // Query the slider fill from the document
      const percentageLabel = page.getByText('75%')
      await expect.element(percentageLabel).toBeInTheDocument()
    })

    it('updates slider fill width when volume changes', async () => {
      render(<VolumeControl />)

      const slider = page.getByRole('slider', { name: 'Volume control' })

      await userEvent.fill(slider, '0.25')

      // Check that the percentage label updated
      const percentageLabel = page.getByText('25%')
      await expect.element(percentageLabel).toBeInTheDocument()
    })
  })
})
