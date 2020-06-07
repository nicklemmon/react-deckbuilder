import React from 'react'
import { Avatar } from 'src/components/Avatar'
import swordImg from 'src/images/sword.png'
import shieldImg from 'src/images/wooden-shield.png'
import { Stats } from 'src/components/Stats'
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

      <Stats>
        <Avatar.Name>{name}</Avatar.Name>

        <Stats.Stat>Level {level}</Stats.Stat>

        <Stats.Stat>{hitPoints} HP</Stats.Stat>

        <Stats.Row>
          <Stats.Stat>
            <Stats.Icon src={swordImg} alt="Attack:" />

            <Stats.Value>{stats.attack}</Stats.Value>
          </Stats.Stat>

          <Stats.Stat>
            <Stats.Icon src={shieldImg} alt="Defense:" />

            <Stats.Value>{stats.defense}</Stats.Value>
          </Stats.Stat>
        </Stats.Row>
      </Stats>

      {damageTaken && <Avatar.Feedback>{damageTaken}</Avatar.Feedback>}
    </Avatar>
  )
}

export default Monster
