import React from 'react'
import styled from 'styled-components'
import { default as DeckInterface } from '../../interfaces/Deck'

interface DeckProps extends DeckInterface {
  children?: any
  isStacked?: boolean
  align?: string
}

const DeckWrapper = styled.div`
  position: relative; /* allows absolute positioning within */
  pointer-events: none; /* allows clicking "through" the deck */
`

const ClearFix = styled.div`
  clear: both;
`

export default function Deck(props: DeckProps) {
  const { children, isStacked = true, align = 'left' } = props

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        cardIndex: index,
        isStacked,
        align,
      })
    })
  }

  return (
    <DeckWrapper>
      {renderChildren()}

      {isStacked && <ClearFix />}
    </DeckWrapper>
  )
}
