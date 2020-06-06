import React from 'react'
import { Avatar } from 'src/components/Avatar'
import { default as MonsterInterface } from 'src/interfaces/Monster'

interface MonsterProps extends MonsterInterface {
  isTakingDamage: boolean
}

function Monster(props: MonsterProps) {
  const { name, level, stats, artwork, isTakingDamage, damageTaken } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} isTakingDamage={isTakingDamage} />

      <Avatar.Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Avatar.Stat>Level {level}</Avatar.Stat>

        <Avatar.Stat>{hitPoints} HP</Avatar.Stat>
      </Avatar.Stats>

      {damageTaken && <Avatar.Feedback>{damageTaken}</Avatar.Feedback>}
    </Avatar>
  )
}

export default Monster
