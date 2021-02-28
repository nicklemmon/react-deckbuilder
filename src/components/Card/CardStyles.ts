import styled from 'styled-components'
import { motion } from 'framer-motion'
import { transparentize } from 'polished'
import { cardWidth, cardOffset, cardHeight } from '../../styles/constants'

const contentLayer = 1

export const Content = styled.div<{ isVisible: boolean; rarity: number }>`
  position: relative; /* allows absolute positioning within */
  display: grid;
  grid-template-rows: 1fr 4fr 1fr;
  text-align: center;
  width: 100%;
  height: 100%;
  font-family: ${props => props.theme.fonts.body};
  border: ${props => props.theme.space[2]} solid ${props => props.theme.colors.white};
  opacity: ${props => (props.isVisible ? 1 : 0)};
`

export const CardWrapper = styled('div')<{
  artwork?: string
  cardIndex: number
  isStacked?: boolean
  align?: string
  isDisabled?: boolean
  isPurchased?: boolean
}>`
  display: inline-flex;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii[1]};
  overflow: hidden;
  height: ${cardHeight};
  width: ${cardWidth};
  perspective: 1000px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-image: ${props => `url(${props.artwork})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${props => props.theme.colors.offWhite};
  transition-duration: ${props => props.theme.duration[1]};
  transition-timing-function: ease-in-out;
  transition-property: transform, box-shadow;
  pointer-events: ${props => (props.isDisabled || props.isPurchased ? 'none' : 'initial')};
  filter: ${props => (props.isDisabled && !props.isPurchased ? 'grayscale(95%)' : 'initial')};

  ${props => {
    if (!props.isDisabled || !props.isPurchased) {
      return `
        :hover {
          transform: translateY(-0.33rem);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }
      `
    }
  }}

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

export const Description = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative; /* allows use of z-index */
  z-index: ${() => contentLayer};
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes[0]};
  line-height: 1.33;
  color: ${props => props.theme.colors.white};
  padding-top: ${props => props.theme.space[1]};
  padding-right: ${props => props.theme.space[1]};
  padding-bottom: ${props => props.theme.space[2]};
  padding-left: ${props => props.theme.space[1]};
  height: 5rem;
  text-shadow: 0 3px 7px rgba(0, 0, 0, 0.66);
  background-color: ${props => props.theme.colors.darkGray};
  transform: translateY(0.75rem);
  clip-path: polygon(50% 10%, 100% 0, 100% 90%, 50% 100%, 0% 90%, 0 0);
`

export const Back = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.darkGray};
  opacity: ${props => (props.isVisible ? 1 : 0)};
`

export const Header = styled('div')`
  padding: ${props => props.theme.space[2]};
  padding-top: ${props => props.theme.space[3]};
`

export const Heading = styled('h3')`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.0125rem;
  color: ${props => props.theme.colors.white};
  background-color: rgba(0, 0, 0, 0.8);
  padding: ${props => props.theme.space[2]};
  clip-path: polygon(100% 0, 97.5% 50%, 100% 100%, 0% 100%, 2.5% 50%, 0% 0%);
  box-shadow: 0 ${props => props.theme.space[2]} 0 -0.25rem rgba(0, 0, 0, 0.25);
`

export const Main = styled('div')`
  align-self: end;
`

export const Footer = styled('div')`
  position: relative;
  background-color: ${props => props.theme.colors.white};
  z-index: ${() => contentLayer};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${props => props.theme.space[1]};
`

export const Overlay = styled(motion.div)`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => transparentize(0.125, props.theme.colors.darkGray)};
`

export const OverlayImg = styled('img')`
  filter: ${props =>
    `drop-shadow(0 ${props.theme.space[1]} ${props.theme.space[2]} rgba(0, 0, 0, 0.75))`};
`

export const OverlayText = styled(motion.div)`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.space[2]} 0;
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes[1]};
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.darkGray};
  text-align: center;
  width: 100%;
`
