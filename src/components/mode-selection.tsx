import { Button } from './button'
import { Inline } from './inline'
import { Panel, PanelBody } from './panel'
import { Stack } from './stack'
import styles from './mode-selection.module.css'

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

              <Button onClick={onRainbowModeClick} className={styles['rainbow-btn']}>
                Rainbow mode
              </Button>
            </Inline>
          </Stack>
        </PanelBody>
      </Panel>
    </div>
  )
}
