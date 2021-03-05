import React from 'react'
import { toTitleCase } from 'src/functions'
import { Avatar, Bar, Feedback, Stats } from 'src/components'
import { Player as PlayerInterface } from 'src/interfaces'
import { AvatarStatus } from 'src/components/Avatar/types'

interface PlayerAvatarProps extends PlayerInterface {
  status: AvatarStatus
  damageTaken?: number | undefined
  goldAwarded?: number | undefined
  healingAmount?: number | undefined
}

function PlayerAvatar(props: PlayerAvatarProps) {
  const {
    characterClass = '',
    characterPortrait,
    name,
    stats,
    status = AvatarStatus['idle'],
    damageTaken,
    healingAmount,
    goldAwarded,
  } = props
  const health = stats.health < 0 ? 0 : stats.health

  return (
    <Avatar>
      <Avatar.Portrait artwork={characterPortrait} status={status} />

      <Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Stats.Row>
          <Stats.Stat>{toTitleCase(characterClass)}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat>{health} HP</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Bar max={stats.maxHealth} current={stats.health} />
        </Stats.Row>
      </Stats>

      {damageTaken ? <Feedback variant="negative">{damageTaken}</Feedback> : null}

      {healingAmount ? <Feedback variant="positive">{healingAmount}</Feedback> : null}

      {goldAwarded ? (
        <Feedback variant="neutral" duration={1}>
          + {goldAwarded} gold
        </Feedback>
      ) : null}
    </Avatar>
  )
}

export default PlayerAvatar
