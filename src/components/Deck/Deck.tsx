import React from 'react'
import { default as DeckInterface } from '../../interfaces/Deck'

interface DeckProps extends DeckInterface {
  children: any
}

export default function Deck(props: DeckProps) {
  const { children } = props

  return <div>{children}</div>
}
