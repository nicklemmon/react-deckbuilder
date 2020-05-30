import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { default as MonsterInterface } from 'src/interfaces/Monster'

function Monster(props: MonsterInterface) {
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

export default Monster
