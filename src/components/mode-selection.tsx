import { Button } from './button'
import { Inline } from './inline'
import { Panel, PanelBody } from './panel'
import { Stack } from './stack'
import hoverMusic from '../sfx/music/music.boogie.wav'
import styles from './mode-selection.module.css'
import { getSound } from '../helpers/get-sound'
import { fadeIn, fadeOut } from '../helpers/fade-sound'
import { useEffect } from 'react'

const boogieMusic = getSound({ src: hoverMusic, volume: 1.0 })

export function ModeSelection({
  onStandardModeClick,
  onRainbowModeClick,
}: {
  /** Handler for clicks on the standard mode button */
  onStandardModeClick: () => void
  /** Handler for clicks on the rainbow mode button */
  onRainbowModeClick: () => void
}) {
  useEffect(() => {
    return () => {
      fadeOut(boogieMusic)
    }
  }, [])

  return (
    <div className={styles['mode-selection']}>
      <Panel>
        <PanelBody>
          <Stack>
            <h2>Select mode</h2>

            <Inline>
              <Button onClick={onStandardModeClick}> Standard mode</Button>

              <Button
                onClick={onRainbowModeClick}
                className={styles['rainbow-btn']}
                onMouseOver={() => {
                  fadeIn(boogieMusic)
                }}
                onMouseOut={() => {
                  fadeOut(boogieMusic)
                }}
              >
                Rainbow mode
              </Button>
            </Inline>
          </Stack>
        </PanelBody>
      </Panel>
    </div>
  )
}
