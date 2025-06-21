import { useState } from 'react'
import css from './mode-select-screen.module.css'

export function ModeSelectScreen() {
  return (
    <div>
      <ModeSelect />
    </div>
  )
}

type ModeSelectProps = {
  /** Fires whenever the user toggles the switch. */
  onChange?: (mode: 'dad' | 'rainbow') => void
}

/**
 * Visually‑custom switch that still relies on a native checkbox for
 * a11y, keyboard support, form compatibility, and reduced JS.
 */
const ModeSelect: React.FC<ModeSelectProps> = ({ onChange }) => {
  /** `false` → Dad mode, `true` → Rainbow mode */
  const [isRainbow, setIsRainbow] = useState(false)

  /** Mirror checkbox state into React state and lift via `onChange` */
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsRainbow(checked)
    onChange?.(checked ? 'rainbow' : 'dad')
  }

  return (
    <div className={css.container}>
      {/* Text label updates live for additional clarity */}
      <span className={css.label} aria-hidden="true">
        {isRainbow ? '🌈 Rainbow mode' : '👨 Dad mode'}
      </span>

      {/* Label ties the visual slider to the hidden checkbox */}
      <label className={css.switch}>
        {/* The real control (visually hidden, but still tabbable/clickable) */}
        <input
          type="checkbox"
          className={css.checkbox}
          checked={isRainbow}
          onChange={handleToggle}
          aria-label="Toggle rainbow mode"
        />

        {/* Styled track + thumb (CSS handles :checked visuals) */}
        <span className={css.slider} aria-hidden="true">
          {/* sparkling overlay */}
          <span className={css.glint} />
        </span>
      </label>
    </div>
  )
}
