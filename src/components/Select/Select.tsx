import React from 'react'
import styled from 'styled-components'
import { formFieldStyles } from 'src/styles/helpers'
import { SelectProps, SelectVariant } from './types'

export const SelectEl = styled.select<{ variant: SelectVariant }>`
  ${formFieldStyles}
`

export default function Select(props: SelectProps) {
  const { variant = SelectVariant['light'], ...rest } = props

  return <SelectEl variant={variant} {...rest} />
}
