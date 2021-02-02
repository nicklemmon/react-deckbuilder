/* ts-ignore */
import React from 'react'

// See: https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
function importAll(assets) {
  let importedAssets = {}
  assets.keys().map((item, index) => {
    return (importedAssets[item.replace('./', '')] = assets(item))
  })

  return importedAssets
}

export function AssetPreloader() {
  const images = importAll(require.context('../../images', false, /\.(png|jpe?g|svg)$/))
  const imageKeys = Object.keys(images)
  const imagesArr = imageKeys.map(key => {
    return {
      name: key,
      src: images[key].default,
    }
  })

  return (
    <>
      {imagesArr.map(image => (
        <img key={image.name} src={image.src} alt="" role="presentation" hidden />
      ))}
    </>
  )
}
