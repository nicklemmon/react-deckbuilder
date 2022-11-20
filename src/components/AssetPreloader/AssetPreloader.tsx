import { useState, useEffect } from 'react'
import { Howl } from 'howler'
import { imagesLoadEvent, sfxLoadEvent } from '../../events'

/** Handles pre-loading static assets before the game begins. Otherwise, assets load in as they appear which feels janky in a game context */
export function AssetPreloader() {
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0)
  const [imagesArr, setImagesArr] = useState<Array<string>>([])
  const [sfxArr, setSfxArr] = useState<Array<string>>([])

  // Increment the loaded count for each image loaded, and dispatch an event when all are loaded
  function handleImgLoad() {
    setImagesLoadedCount(imagesLoadedCount + 1)

    if (imagesLoadedCount === imagesArr.length - 1) {
      window.dispatchEvent(imagesLoadEvent)
    }
  }

  // Load all SFX so they will be cached and then dispatch a custom event attached to the window
  useEffect(() => {
    new Howl({
      src: sfxArr,
      preload: true,
      onload: () => window.dispatchEvent(sfxLoadEvent),
    })
  }, [sfxArr])

  // Fetch all image files
  useEffect(() => {
    const fetchImages = async () => {
      const images: Array<string> = await getImagesArray()

      setImagesArr(images)
    }

    fetchImages()
  }, [])

  // Fetch all sound files
  useEffect(() => {
    const fetchSounds = async () => {
      const sounds: Array<string> = await getSfxArray()

      setSfxArr(sounds)
    }

    fetchSounds()
  }, [])

  // Render hidden images to the DOM so they will load and be cached by the browser and update the loaded count
  return (
    <>
      {imagesArr.map((image) => (
        <img key={image} src={image} alt="" onLoad={handleImgLoad} role="presentation" hidden />
      ))}
    </>
  )
}

/** Generates an array of objects containing meta information derived from static image files */
async function getImagesArray(): Promise<Array<string>> {
  const images = import.meta.glob('../../images/*.(png|svg)', { eager: true })
  /* @ts-expect-error */
  const imagesArr = Object.entries(images).map(([_path, mod]) => mod?.default)

  return imagesArr
}

/** Generates an array of objects containing meta information derived from static sound files */
async function getSfxArray(): Promise<Array<string>> {
  const sounds = import.meta.glob('../../sounds/**.wav', { eager: true })
  /* @ts-expect-error */
  const soundsArr = Object.entries(sounds).map(([_path, mod]) => mod?.default)

  return soundsArr
}
