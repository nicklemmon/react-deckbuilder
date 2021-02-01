import React from 'react'
import styled from 'styled-components'
import { formFieldStyles } from 'src/styles/helpers'
import { SelectProps, SelectVariant } from './types'

const SelectElWrapper = styled.div``

export const SelectEl = styled.select<{ variant: SelectVariant }>`
  ${formFieldStyles}
`

export default function Select(props: SelectProps) {
  const { variant = SelectVariant['light'], ...rest } = props

  return (
    <SelectElWrapper>
      <SelectEl variant={variant} {...rest} />
    </SelectElWrapper>
  )
}
