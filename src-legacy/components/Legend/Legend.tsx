import React from 'react'
import styled from 'styled-components'
import { labelStyles } from '../../styles/helpers'
import { LegendProps } from './types'

const LegendEl = styled.legend`
  ${labelStyles}
`

export function Legend(props: LegendProps) {
  const { children } = props

  return <LegendEl>{children}</LegendEl>
}
