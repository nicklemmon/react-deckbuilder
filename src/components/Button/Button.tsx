import React from 'react'
import styled from 'styled-components'

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
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.pink};
  border: 0;
  border-radius: ${props => props.theme.radii[0]};
  box-shadow: 0 ${props => props.theme.space[1]} 0 ${props => props.theme.colors.darkPink};
  transition: filter ${props => props.theme.duration[0]} ease-in-out;

  &:hover {
    filter: brightness(1.125) drop-shadow(0 10px 20px #000);
  }
`

export default function Button(props: ButtonProps) {
  const { variant, children, onClick, style } = props

  return (
    <ButtonEl style={style} variant={variant} onClick={onClick}>
      {children}
    </ButtonEl>
  )
}
