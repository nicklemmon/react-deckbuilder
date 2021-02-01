import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { ButtonProps, ButtonVariant } from './types'

const ButtonEl = styled.button<{ variant: ButtonVariant }>`
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[3]};
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes[2]};
  border: 0;
  border-radius: ${props => props.theme.radii[0]};
  transition: ${props => `box-shadow ${props.theme.duration[0]} ease-in-out`};

  ${props => {
    const getBoxShadow = (color: string) =>
      `0 ${props.theme.space[1]} 0 ${color}, 0 ${props.theme.space[1]} ${
        props.theme.space[2]
      } ${transparentize(0.75, props.theme.colors.darkGray)}`

    switch (props.variant) {
      case ButtonVariant['primary']:
        return {
          'background-color': props.theme.colors.pink,
          color: props.theme.colors.white,
          'box-shadow': getBoxShadow(props.theme.colors.darkPink),
        }
      case ButtonVariant['secondary']:
        return {
          'background-color': props.theme.colors.white,
          color: props.theme.colors.pink,
          'box-shadow': getBoxShadow(props.theme.colors.pink),
        }
      default:
        return
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px currentColor;
  }
`

export default function Button(props: ButtonProps) {
  const { variant, type = 'button', ...rest } = props

  return <ButtonEl variant={variant} type={type} {...rest} />
}
