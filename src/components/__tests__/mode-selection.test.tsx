import { useState } from 'react'
import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { ModeSelection } from '../mode-selection'
import { fadeOut } from '../../helpers/fade-sound'

vi.mock('../../helpers/fade-sound', () => ({ fadeIn: vi.fn(), fadeOut: vi.fn() }))

function RainbowSelection() {
  const [showSelection, setShowSelection] = useState(true)
  return showSelection ? (
    <ModeSelection
      onStandardModeClick={() => setShowSelection(false)}
      onRainbowModeClick={() => setShowSelection(false)}
    />
  ) : null
}

describe('ModeSelection', () => {
  it('keeps Rainbow music playing after selecting Rainbow mode', async () => {
    await render(<RainbowSelection />)
    await page.getByRole('button', { name: 'Rainbow mode' }).click()
    expect(fadeOut).not.toHaveBeenCalled()
  })

  it('stops preview music after selecting Standard mode', async () => {
    vi.mocked(fadeOut).mockClear()
    await render(<RainbowSelection />)
    await page.getByRole('button', { name: 'Standard mode' }).click()
    expect(fadeOut).toHaveBeenCalled()
  })
})
