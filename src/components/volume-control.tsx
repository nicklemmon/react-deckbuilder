import { useState, useEffect } from 'react'
import { Howler } from 'howler'
import css from './volume-control.module.css'

const VOLUME_STORAGE_KEY = 'game-volume'
const DEFAULT_VOLUME = 0.7

function getStoredVolume(): number {
  const stored = localStorage.getItem(VOLUME_STORAGE_KEY)
  if (stored === null) {
    return DEFAULT_VOLUME
  }
  const parsed = parseFloat(stored)
  return isNaN(parsed) ? DEFAULT_VOLUME : Math.max(0, Math.min(1, parsed))
}

type VolumeIconProps = {
  volume: number
}

function VolumeIcon({ volume }: VolumeIconProps) {
  const getIconClass = () => {
    if (volume === 0) return css['muted']
    if (volume < 0.5) return css['low']
    return css['high']
  }

  if (volume === 0) {
    return (
      <svg className={`${css['icon']} ${getIconClass()}`} viewBox="0 0 24 24" fill="none">
        <path
          d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (volume < 0.5) {
    return (
      <svg className={`${css['icon']} ${getIconClass()}`} viewBox="0 0 24 24" fill="none">
        <path
          d="M7 9v6h4l5 5V4l-5 5H7zm7.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg className={`${css['icon']} ${getIconClass()}`} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        fill="currentColor"
      />
    </svg>
  )
}

export function VolumeControl() {
  const [volume, setVolume] = useState(() => getStoredVolume())

  // Set initial volume on mount
  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    Howler.volume(newVolume)
    localStorage.setItem(VOLUME_STORAGE_KEY, String(newVolume))
  }

  const volumePercentage = Math.round(volume * 100)

  return (
    <div className={css['volume-control']}>
      <div className={css['icon-wrapper']}>
        <VolumeIcon volume={volume} />
      </div>
      <div className={css['slider-container']}>
        <div className={css['slider-bg']}>
          <div className={css['slider-fill']} style={{ width: `${volumePercentage}%` }} />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleChange}
          aria-label="Volume control"
        />
        <div className={css['volume-label']}>{volumePercentage}%</div>
      </div>
    </div>
  )
}
