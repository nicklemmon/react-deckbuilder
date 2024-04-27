import { Avatar } from '../Avatar'
import { Feedback } from '../Feedback'
import { Stats, AttackStat, DefenseStat, Bar } from '../Stats'
import { AvatarStatus } from '../Avatar/types'

interface MonsterProps {
  id: string
  name: string
  level: number
  goldBounty: number
  artwork?: string
  damageTaken?: number
  status: AvatarStatus
  stats: {
    maxHealth: number
    health: number
    attack: number
    defense: number
  }
}

function Monster(props: MonsterProps) {
  const { name, level, stats, artwork, status = AvatarStatus['idle'], damageTaken } = props
  const health = stats.health < 0 ? 0 : stats.health

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} status={status} />

      <Stats>
        <Avatar.Name appearance="inverted">{name}</Avatar.Name>

        <Stats.Row>
          <Stats.Stat appearance="inverted">Level {level}</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <Stats.Stat appearance="inverted">{health} HP</Stats.Stat>
        </Stats.Row>

        <Stats.Row>
          <AttackStat appearance="inverted">{stats.defense}</AttackStat>

          <DefenseStat appearance="inverted">{stats.defense}</DefenseStat>
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
