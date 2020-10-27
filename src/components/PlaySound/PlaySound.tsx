import React, { useEffect } from 'react'
import useSound from 'use-sound'

interface PlaySoundProps {
  sound: string
}

export default function PlaySound(props: PlaySoundProps) {
  const { sound } = props
  const [play] = useSound(sound)

  useEffect(() => {
    play()
  }, [play])

  return <></>
}
