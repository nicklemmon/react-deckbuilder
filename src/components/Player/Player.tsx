import React from 'react'
import { toTitleCase } from 'src/functions'
import { Avatar } from 'src/components/Avatar'
import { Feedback } from 'src/components'
import { Stats, Bar } from 'src/components/Stats'
import { default as PlayerInterface } from 'src/interfaces/Player'

interface PlayerAvatarProps extends PlayerInterface {
  isTakingDamage: boolean
  damageTaken?: any // :(
}

function PlayerAvatar(props: PlayerAvatarProps) {
  const { characterClass = '', name, level, stats, artwork, isTakingDamage, damageTaken } = props
  const health = stats.health < 0 ? 0 : stats.health

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} isTakingDamage={isTakingDamage} />

      <Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Stats.Row>
          <Stats.Stat>{toTitleCase(characterClass)}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat>Level {level}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat>{health} HP</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Bar max={stats.maxHealth} current={stats.health} />
        </Stats.Row>
      </Stats>

      {damageTaken && <Feedback>{damageTaken}</Feedback>}
    </Avatar>
  )
}

export default PlayerAvatar
