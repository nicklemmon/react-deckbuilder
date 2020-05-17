import React from 'react'
import styled from 'styled-components'
import { default as DeckInterface } from '../../interfaces/Deck'

interface DeckProps extends DeckInterface {
  children?: any
  isStacked?: boolean
}

const DeckGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(7, 1fr);
`

export default function Deck(props: DeckProps) {
  const { children, isStacked = true } = props

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        cardIndex: index,
        isStacked,
      })
    })
  }

  return <DeckGrid>{renderChildren()}</DeckGrid>
}
