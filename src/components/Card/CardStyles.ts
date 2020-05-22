import styled from 'styled-components'
import { cardWidth, cardOffset, cardHeight, secondaryFontFamily } from '../../styles/constants'

export const CardWrapper = styled.div<{ cardIndex: number; isStacked?: boolean; align?: string }>`
  display: inline-flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: ${cardHeight};
  width: ${cardWidth};
  perspective: 1000px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.0875);

  ${props => {
    if (!props.isStacked) {
      return {
        'margin-left': props.cardIndex === 0 ? '0' : '1rem',
      }
    }

    if (props.isStacked) {
      // Each card index dynamically transforms the card in to what visually looks like a stacked deck

      if (props.align === 'left') {
        return {
          float: 'left',
          transform: `translateX(-${cardOffset * props.cardIndex}rem)`,
        }
      }

      if (props.align === 'right') {
        return {
          float: 'right',
          transform: `translateX(${cardOffset * props.cardIndex}rem)`,
        }
      }
    }
  }}
`

export const Content = styled.div<{ isVisible: boolean }>`
  display: grid;
  grid-template-rows: 1fr 4fr 1fr;
  text-align: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`

export const Back = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #293845;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`

export const Header = styled('div')`
  ${secondaryFontFamily()}
  padding: 2rem 1rem 1rem 1rem;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.01rem;
`

export const Main = styled('div')`
  padding: 1rem;
  align-self: center;
`

export const Footer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  /* background-color: #f7f7f7; */
`

export const Stats = styled('div')``

export const Stat = styled('div')`
  display: flex;
  align-items: center;
`

export const StatNumber = styled('span')`
  margin-left: 0.5rem;
`

export const Rarity = styled('div')``

export const CardIcon = styled('img')`
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 0.25rem;
  overflow: hidden;
`
