import { useEffect, useRef } from 'react'
import { Howler } from 'howler'
import { Button } from './button'
import { Inline } from './inline'
import { Panel, PanelBody } from './panel'
import { Stack } from './stack'
import hoverMusic from '../sfx/music/music.boogie.wav'
import styles from './mode-selection.module.css'
import { getSound } from '../helpers/get-sound'

const boogieMusic = getSound({ src: hoverMusic, volume: 1.0 })

boogieMusic.fade(0, 1, 500)

export function ModeSelection({
  onStandardModeClick,
  onRainbowModeClick,
}: {
  onStandardModeClick: () => void
  onRainbowModeClick: () => void
}) {
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
                  boogieMusic.play()
                }}
                onMouseOut={() => {
                  boogieMusic.stop()
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
