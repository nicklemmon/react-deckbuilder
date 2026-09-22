import { Button } from './button'
import { Inline } from './inline'
import { Panel, PanelBody } from './panel'
import { Stack } from './stack'
import styles from './mode-selection.module.css'
import { fadeIn, fadeOut } from '../helpers/fade-sound'
import { useEffect, useRef } from 'react'
import { TRACKS } from '../machines/soundtrack-machine/tracks'

const boogieMusic = TRACKS.boogie.sound

export function ModeSelection({
  onStandardModeClick,
  onRainbowModeClick,
}: {
  /** Handler for clicks on the standard mode button */
  onStandardModeClick: () => void
  /** Handler for clicks on the rainbow mode button */
  onRainbowModeClick: () => void
}) {
  const rainbowSelected = useRef(false)

  useEffect(() => {
    return () => {
      if (!rainbowSelected.current) fadeOut(boogieMusic)
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
                onClick={() => {
                  rainbowSelected.current = true
                  onRainbowModeClick()
                }}
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
