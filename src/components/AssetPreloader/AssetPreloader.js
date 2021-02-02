/* ts-ignore */
import React from 'react'

function importAll(assets) {
  let images = {}
  assets.keys().map((item, index) => {
    return (images[item.replace('./', '')] = assets(item))
  })

  return images
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
