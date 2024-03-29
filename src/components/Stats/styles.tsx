import styled from 'styled-components'
import { Stats } from '../Stats'
import swordImg from '../../images/sword.png'
import shieldImg from '../../images/wooden-shield.png'
import goldCoinsImg from '../../images/gold-coins.png'
import heartImg from '../../images/heart.png'

interface StatProps {
  children: any
  appearance?: 'normal' | 'inverted'
}

export function AttackStat(props: StatProps) {
  const { children, appearance = 'normal' } = props

  return (
    <Stats.Stat appearance={appearance}>
      <Stats.Icon src={swordImg} alt="Attack:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

export function DefenseStat(props: StatProps) {
  const { children, appearance = 'normal' } = props

  return (
    <Stats.Stat appearance={appearance}>
      <Stats.Icon src={shieldImg} alt="Defense:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

export function GoldStat(props: StatProps) {
  const { children, appearance = 'normal' } = props

  return (
    <Stats.Stat appearance={appearance}>
      <Stats.Icon src={goldCoinsImg} alt="Gold:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

export function HealthStat(props: StatProps) {
  const { children, appearance = 'normal' } = props

  return (
    <Stats.Stat appearance={appearance}>
      <Stats.Icon src={heartImg} alt="Health:" />

      <Stats.Value>{children}</Stats.Value>
    </Stats.Stat>
  )
}

const BarWrapper = styled.div<{ status: string }>`
  position: relative;
  display: flex;
  border-radius: ${(props) => props.theme.radii[0]};
  overflow: hidden;
  height: ${(props) => props.theme.space[3]};
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.red};
  background: ${(props) =>
    `linear-gradient(180deg, ${props.theme.colors.darkGray} 10%, ${props.theme.colors.gray} 100%)`};
  box-shadow: ${(props) => props.theme.shadows[0]},
    0px 0px 0px 1px ${(props) => props.theme.colors.lightGray};
`

const BarFill = styled.div<{ percentage: number; status: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(props) => `${props.percentage}%`};
  background-color: ${(props) => props.theme.colors.red};
  background: ${(props) =>
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
