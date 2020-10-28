import React from 'react'
import styled from 'styled-components'
import { Stats } from 'src/components/Stats'
import swordImg from 'src/images/sword.png'
import shieldImg from 'src/images/wooden-shield.png'
import goldImg from 'src/images/gold-coin.png'

interface StatProps {
  children: any
}

export function AttackStat(props: StatProps) {
  const { children } = props

  return (
    <Stats.Stat>
      <Stats.Icon src={swordImg} alt="Attack:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

export function DefenseStat(props: StatProps) {
  const { children } = props

  return (
    <Stats.Stat>
      <Stats.Icon src={shieldImg} alt="Defense:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

export function GoldStat(props: StatProps) {
  const { children } = props

  return (
    <Stats.Stat>
      <Stats.Icon src={goldImg} alt="Gold:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

const BarWrapper = styled.div<{ status: string }>`
  position: relative;
  display: flex;
  border-radius: ${props => props.theme.radii[0]};
  overflow: hidden;
  height: ${props => props.theme.space[3]};
  width: 100%;
  border: 1px solid ${props => props.theme.colors.darkGray};
  background: ${props =>
    `linear-gradient(180deg, ${props.theme.colors.darkGray} 10%, ${props.theme.colors.gray} 100%)`};
  box-shadow: ${props => props.theme.shadows[0]},
    0px 0px 0px 1px ${props => props.theme.colors.lightGray};
`

const BarFill = styled.div<{ percentage: number; status: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => props.theme.colors.red};
  background: ${props =>
    `linear-gradient(180deg, ${props.theme.colors.lightRed} 0%, ${props.theme.colors.darkRed} 80%, ${props.theme.colors.darkRed} 100%)`};
`

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

export function Bar(props: StatsBarProps) {
  const { max, current } = props
  const percentage = (current / max) * 100
  const status = getStatus(percentage) // TODO: Incorporate dynamic colors based on status

  return (
    <BarWrapper status={status}>
      <BarFill percentage={percentage} status={status} />
    </BarWrapper>
  )
}
