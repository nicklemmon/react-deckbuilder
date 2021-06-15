import { Avatar } from 'src/components/Avatar'
import { Feedback } from 'src/components'
import { Stats, AttackStat, DefenseStat, Bar } from 'src/components/Stats'
import { AvatarStatus } from 'src/components/Avatar/types'

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
  console.log('props', props)
  const { name, level, stats, artwork, status = AvatarStatus['idle'], damageTaken } = props
  const health = stats.health < 0 ? 0 : stats.health

  return (
    <Avatar>
      <Avatar.Portrait artwork={artwork} status={status} />

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
