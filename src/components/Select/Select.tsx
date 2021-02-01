import React from 'react'
import styled from 'styled-components'
import RoyalDaggerImg from 'src/images/royal-dagger.png'
import { formFieldStyles } from 'src/styles/helpers'
import { SelectProps, SelectVariant } from './types'

const SelectElWrapper = styled.div`
  position: relative;
`

const SelectEl = styled.select<{ variant: SelectVariant }>`
  ${formFieldStyles}
`

const SelectIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  height: 100%;
  opacity: 0.75;
  padding: ${props => props.theme.space[2]};
  pointer-events: none;
  filter: grayscale(100%);
`

export default function Select(props: SelectProps) {
  const { variant = SelectVariant['light'], ...rest } = props

  return (
    <SelectElWrapper>
      <SelectEl variant={variant} {...rest} />

      <SelectIcon src={RoyalDaggerImg} alt="" role="presentation" />
    </SelectElWrapper>
  )
}
