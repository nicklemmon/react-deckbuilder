import React from 'react'
import { Avatar } from '../Avatar'

interface PlayerAvatarProps {
  name: string
  level: number
  artwork?: string

  stats: {
    hitPoints: number
    attack: number
    defense: number
  }
}

function PlayerAvatar(props: PlayerAvatarProps) {
  const { name, level, stats, artwork } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} />

      <Avatar.Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Avatar.Stat>Level {level}</Avatar.Stat>

        <Avatar.Stat>{hitPoints} HP</Avatar.Stat>
      </Avatar.Stats>
    </Avatar>
  )
}

export default PlayerAvatar
