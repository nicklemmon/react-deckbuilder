import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { ItemStatus } from 'src/interfaces'

export const ItemWrapper = styled.div<{ status: ItemStatus }>`
  position: relative; /* allows absolute positioning within */
  display: inline-flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radii[1]};
  width: 10rem;
  height: 10rem;
  padding: ${props => props.theme.space[2]};
  perspective: 1000px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows[0]};
  transition-duration: ${props => props.theme.duration[1]};
  transition-timing-function: ease-in-out;
  transition-property: transform, box-shadow;
  pointer-events: ${props => getPointerEventsStyles(props.status)};
  filter: ${props => getFilterStyles(props.status)};

  ${props => {
    if (props.status === ItemStatus['idle']) {
      return css`
        :hover {
          transform: translateY(-0.25rem);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
        }
      `
    }
  }}
`

function getFilterStyles(status: ItemStatus) {
  switch (status) {
    case ItemStatus['disabled']: {
      return 'grayscale(95%)'
    }

    case ItemStatus['purchased']: {
      return 'unset'
    }

    default: {
      return 'unset'
    }
  }
}

function getPointerEventsStyles(status: ItemStatus) {
  switch (status) {
    case ItemStatus['disabled']:
    case ItemStatus['purchased']: {
      return 'none'
    }

    default: {
      return 'initial'
    }
  }
}

export const ArtworkWrapper = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Artwork = styled('div')<{ artwork?: string }>`
  width: 90%;
  height: 90%;
  transform: translateX(5%) translateY(5%) rotate(-15deg);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${props => `url(${props.artwork})`};
`

export const Badge = styled('span')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: ${props => props.theme.fontSizes[1]};
  bottom: ${props => props.theme.space[1]};
  right: ${props => props.theme.space[1]};
  width: ${props => props.theme.space[4]};
  height: ${props => props.theme.space[4]};
  border-radius: 50%;
  padding: ${props => props.theme.space[1]};
  background-color: ${props => props.theme.colors.darkGreen};
  text-shadow: ${props => `0 2px 5px ${darken(0.15, props.theme.colors.darkGreen)}`};
  box-shadow: ${props =>
    `inset 0 -2px 3px ${darken(0.15, props.theme.colors.darkGreen)},
    inset 0 3px 3px ${props.theme.colors.green},
    0 1px 2px ${props.theme.colors.gray}`};
  color: ${props => props.theme.colors.white};
`

export const Description = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10%;
  left: 50%;
  width: 115%;
  text-align: center;
  transform: translateX(-50%);
  font-size: ${props => props.theme.fontSizes[0]};
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.darkGray};
  padding: ${props => props.theme.space[1]};
`

export const Footer = styled('div')`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
