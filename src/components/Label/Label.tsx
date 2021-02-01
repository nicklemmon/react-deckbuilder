import React from 'react'
import styled from 'styled-components'
import { LabelProps, LabelVariant } from './types'

const LabelEl = styled.label<{ variant: LabelVariant }>`
  display: block;
  font-size: ${props => props.theme.fontSizes[1]};
  font-family: ${props => props.theme.fonts.heading};
  color: currentColor;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
  margin-bottom: ${props => props.theme.space[2]};
`

export default function Label(props: LabelProps) {
  const { as = 'label', variant = LabelVariant['light'], className, children } = props

  return (
    <LabelEl as={as} variant={variant} className={className}>
      {children}
    </LabelEl>
  )
}
