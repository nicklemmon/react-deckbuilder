import React from 'react'
import styled from 'styled-components'
import { LabelProps, LabelVariant } from './types'
import { labelStyles } from 'src/styles/helpers'

const LabelEl = styled.label<{ variant: LabelVariant }>`
  ${labelStyles}
`

export default function Label(props: LabelProps) {
  const { variant = LabelVariant['light'], className, children, htmlFor } = props

  return (
    <LabelEl variant={variant} className={className} htmlFor={htmlFor}>
      {children}
    </LabelEl>
  )
}
