import React from 'react'
import styled from 'styled-components'

interface ButtonProps {
  variant: string
  children: any
  onClick: any // :shrug-emoji:
  style?: object
}

const ButtonEl = styled.button<{ variant: string }>`
  padding: ${props => props.theme.space[2]} ${props => props.theme.space[3]};
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes[1]};
  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.darkGray};
  border: 1px solid ${props => props.theme.colors.offWhite};
  border-radius: ${props => props.theme.radii[1]};
  box-shadow: 0 ${props => props.theme.space[1]} 0 ${props => props.theme.colors.offWhite};
`

export default function Button(props: ButtonProps) {
  const { variant, children, onClick, style } = props

  return (
    <ButtonEl style={style} variant={variant} onClick={onClick}>
      {children}
    </ButtonEl>
  )
}
