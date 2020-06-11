import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { Stats, AttackStat, DefenseStat } from 'src/components/Stats'
import { default as PlayerInterface } from 'src/interfaces/Player'

interface PlayerAvatarProps extends PlayerInterface {
  isTakingDamage: boolean
  damageTaken?: any // :(
}

function PlayerAvatar(props: PlayerAvatarProps) {
  const { name, level, stats, artwork, isTakingDamage, damageTaken } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} isTakingDamage={isTakingDamage} />

      <Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Stats.Row>
          <Stats.Stat>Level {level}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat>{hitPoints} HP</Stats.Stat>
        </Stats.Row>
      </Stats>

      {damageTaken && <Avatar.Feedback>{damageTaken}</Avatar.Feedback>}
    </Avatar>
  )
}

export default PlayerAvatar
