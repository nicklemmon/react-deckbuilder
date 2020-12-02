import React from 'react'
import styled from 'styled-components'
import { TextInputProps, TextInputVariant } from './types'

export const InputEl = styled.input<{ variant: TextInputVariant }>`
  appearance: none;
  padding: ${props => props.theme.space[2]};
  border: 1px solid ${props => props.theme.colors.darkGray};
  font-size: ${props => props.theme.fontSizes[2]};
  background: transparent;
  color: currentColor;
  box-shadow: ${props => props.theme.shadows[0]};
  width: 100%;

  &:focus,
  &:hover {
    border-color: ${props => props.theme.colors.gray};
  }
`

export default function TextField(props: TextInputProps) {
  const { variant = TextInputVariant['light'], ...rest } = props

  return <InputEl variant={variant} {...rest} />
}
