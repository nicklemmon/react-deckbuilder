import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'

interface ButtonProps {
  variant: string
  children: any
  onClick?: () => void
  style?: object
}

const ButtonEl = styled.button<{ variant: string }>`
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[3]};
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes[2]};
  border: 0;
  border-radius: ${props => props.theme.radii[0]};
  transition: filter ${props => props.theme.duration[0]} ease-in-out;

  &:hover {
    filter: brightness(1.125);
  }

  ${props => {
    const getBoxShadow = (color: string) =>
      `0 ${props.theme.space[1]} 0 ${color}, 0 ${props.theme.space[1]} ${
        props.theme.space[2]
      } ${transparentize(0.75, props.theme.colors.darkGray)}`

    switch (props.variant) {
      case 'primary':
        return {
          'background-color': props.theme.colors.pink,
          color: props.theme.colors.white,
          'box-shadow': getBoxShadow(props.theme.colors.darkPink),
        }
      case 'secondary':
        return {
          'background-color': props.theme.colors.white,
          color: props.theme.colors.pink,
          'box-shadow': getBoxShadow(props.theme.colors.pink),
        }
      default:
        return
    }
  }}
`

export default function Button(props: ButtonProps) {
  const { variant, children, onClick, style } = props

  return (
    <ButtonEl style={style} variant={variant} onClick={onClick}>
      {children}
    </ButtonEl>
  )
}