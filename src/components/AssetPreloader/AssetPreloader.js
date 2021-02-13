import React from 'react'
import { Howl } from 'howler'
import { imagesLoadEvent, sfxLoadEvent } from 'src/events'

export function AssetPreloader() {
  const [imagesLoadedCount, setImagesLoadedCount] = React.useState(0)
  const imagesArr = getImagesArray()
  const sfxArr = getSfxArray()

  // Increase the loaded count for each image loaded
  function handleImgLoad() {
    setImagesLoadedCount(imagesLoadedCount + 1)
  }

  // When all images are loaded, dispatch a custom event attached to the window
  React.useEffect(() => {
    if (imagesLoadedCount === imagesArr.length) {
      window.dispatchEvent(imagesLoadEvent)
    }
  }, [imagesLoadedCount, imagesArr])

  // Load all SFX so they will be cached and then dispatch a custom event attached to the window
  new Howl({
    src: sfxArr.map(sfx => sfx.src),
    preload: true,
    onload: () => window.dispatchEvent(sfxLoadEvent),
  })

  // Render hidden images to the DOM so they will load and be cached by the browser and update the loaded count
  return (
    <>
      {imagesArr.map(image => (
        <img
          key={image.name}
          src={image.src}
          alt=""
          onLoad={handleImgLoad}
          role="presentation"
          hidden
        />
      ))}
    </>
  )
}

// See: https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
function importAll(assets) {
  let importedAssets = {}
  assets.keys().map((item, index) => {
    return (importedAssets[item.replace('./', '')] = assets(item))
  })

  return importedAssets
}

/**
 * Generates an array of objects containing meta information derived from static image files
 */
function getImagesArray() {
  const assets = importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/))
  const assetKeys = Object.keys(assets)
  const assetsArr = assetKeys.map(key => {
    return {
      name: key,
      src: assets[key].default,
    }
  })

  return assetsArr
}

/**
 * Generates an array of objects containing meta information derived from static sound files
 */
function getSfxArray() {
  const assets = importAll(require.context('../../sounds', false, /\.(wav|flac)$/))
  const assetKeys = Object.keys(assets)
  const assetsArr = assetKeys.map(key => {
    return {
      name: key,
      src: assets[key].default,
    }
  })

  return assetsArr
}
