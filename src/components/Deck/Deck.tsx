import React from 'react'
import styled from 'styled-components'
import { default as DeckInterface } from '../../interfaces/Deck'

interface DeckProps extends DeckInterface {
  children?: any
}

const StyledDeck = styled('div')`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(7, 1fr);
`

export default function Deck(props: DeckProps) {
  const { children } = props

  return <StyledDeck>{children}</StyledDeck>
}
