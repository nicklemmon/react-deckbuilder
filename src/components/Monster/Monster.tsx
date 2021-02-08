import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Feedback } from 'src/components'
import { Stats, AttackStat, DefenseStat, Bar } from 'src/components/Stats'
import { default as MonsterInterface } from 'src/interfaces/Monster'

interface MonsterProps extends MonsterInterface {
  isTakingDamage: boolean
}

function Monster(props: MonsterProps) {
  const { name, level, stats, artwork, isTakingDamage, damageTaken } = props
  const health = stats.health < 0 ? 0 : stats.health

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} isTakingDamage={isTakingDamage} />

      <Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Stats.Row>
          <Stats.Stat>Level {level}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat>{health} HP</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <AttackStat>{stats.defense}</AttackStat>

          <DefenseStat>{stats.defense}</DefenseStat>
        </Stats.Row>

        <Stats.Row>
          <Bar max={stats.maxHealth} current={stats.health} />
        </Stats.Row>
      </Stats>

      {damageTaken && <Feedback variant="negative">{damageTaken}</Feedback>}
    </Avatar>
  )
}

export default Monster
