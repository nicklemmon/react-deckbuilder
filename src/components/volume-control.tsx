import { useState, useEffect } from 'react'
import { Howler } from 'howler'
import css from './volume-control.module.css'

const VOLUME_STORAGE_KEY = 'game-volume' as const

const DEFAULT_VOLUME = 0.7 as const

/** Returns the stored volume from local storage */
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
      <svg
        className={`${css['icon']} ${getIconClass()}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    )
  }

  if (volume < 0.5) {
    return (
      <svg
        className={`${css['icon']} ${getIconClass()}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    )
  }

  return (
    <svg
      className={`${css['icon']} ${getIconClass()}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
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
          <div
            className={css['slider-fill']}
            style={{ clipPath: `inset(0 ${100 - volumePercentage}% 0 0)` }}
          />
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
