import { Panel, PanelBody } from './panel'
import { Stack } from './stack'
import { cssClass } from '../helpers/css'
import css from './app-preloader.module.css'

/** Shows asset loading progress while the game starts */
export function AppPreloader({ loaded, total }: { loaded: number; total: number }) {
  const percentage = total > 0 ? Math.min(1, loaded / total) : 0
  const percentageText = Math.floor(percentage * 100)

  return (
    <Panel className={cssClass(css, 'preloader')}>
      <PanelBody>
        <Stack align="center">
          <p className={css['label']} id="app-preloader-label">
            Shuffling the deck…
          </p>

          <div
            className={css['progress-bar']}
            role="progressbar"
            aria-labelledby="app-preloader-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentageText}
            style={{ '--progress-percentage': `${percentage}` } as React.CSSProperties}
          >
            <div className={css['progress-bar-fill']} />
          </div>

          <p className={css['percentage']}>{percentageText}%</p>
        </Stack>
      </PanelBody>
    </Panel>
  )
}
