import React from 'react'
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
