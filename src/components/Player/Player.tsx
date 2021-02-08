import React from 'react'
import { toTitleCase } from 'src/functions'
import { Avatar, Bar, Feedback, Stats } from 'src/components'
import { useSound } from 'src/hooks'
import coinsSound from 'src/sounds/items.coin.wav'
import { default as PlayerInterface } from 'src/interfaces/Player'

interface PlayerAvatarProps extends PlayerInterface {
  isTakingDamage: boolean
  damageTaken?: any // :(
  goldAwarded?: any // :(
}

function PlayerAvatar(props: PlayerAvatarProps) {
  const {
    characterClass = '',
    name,
    level,
    stats,
    artwork,
    isTakingDamage,
    damageTaken,
    goldAwarded,
  } = props
  const health = stats.health < 0 ? 0 : stats.health
  const rewardSound = useSound({ src: coinsSound })

  React.useEffect(() => {
    if (goldAwarded) rewardSound.play()
  }, [goldAwarded, rewardSound])

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

      {damageTaken ? <Feedback variant="negative">{damageTaken}</Feedback> : null}

      {goldAwarded ? (
        <Feedback variant="neutral" duration={1}>
          + {goldAwarded} gold
        </Feedback>
      ) : null}
    </Avatar>
  )
}

export default PlayerAvatar
