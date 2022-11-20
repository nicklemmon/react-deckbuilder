import React from 'react'
import styled from 'styled-components'
import { formFieldStyles } from '../../styles/helpers'
import { TextInputProps, TextInputVariant } from './types'

export const InputEl = styled.input<{ variant: TextInputVariant }>`
  ${formFieldStyles}
`

export default function TextField(props: TextInputProps) {
  const { variant = TextInputVariant['light'], ...rest } = props

  return <InputEl variant={variant} {...rest} />
}
