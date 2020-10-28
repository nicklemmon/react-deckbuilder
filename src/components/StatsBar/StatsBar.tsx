import React from 'react'
import { OuterWrapper, Fill } from './StatsBarStyles'

enum StatsBarStatus {
  Good = 'good',
  Warning = 'warning',
  Bad = 'bad',
}

interface StatsBarProps {
  max: number
  current: number
}

function getStatus(percentage: number): StatsBarStatus {
  if (percentage >= 50) {
    return StatsBarStatus.Good
  }

  if (percentage >= 25) {
    return StatsBarStatus.Warning
  }

  return StatsBarStatus.Bad
}

export default function StatsBar(props: StatsBarProps) {
  const { max, current } = props
  const percentage = (current / max) * 100
  const status = getStatus(percentage) // TODO: Incorporate dynamic colors based on status

  return (
    <OuterWrapper status={status}>
      <Fill percentage={percentage} status={status} />
    </OuterWrapper>
  )
}
