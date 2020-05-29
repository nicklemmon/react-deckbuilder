import React from 'react'
import styled from 'styled-components'

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

const Portrait = styled.div<{ artwork?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  text-align: center;
  background: tomato;
  height: 10rem;
  width: 10rem;
  padding: 1rem;
  border-radius: 50%;
  background-image: ${props => `url(${props.artwork})`};
  background-size: cover;
  border: ${props => props.theme.space[2]} solid ${props => props.theme.colors.white};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
  margin-bottom: ${props => props.theme.space[3]};
`

const Stats = styled.div`
  color: ${props => props.theme.colors.darkGray};
  text-align: center;
`

const Stat = styled.div`
  color: ${props => props.theme.colors.gray};
  font-size: ${props => props.theme.fontSizes[1]};
  margin-top: ${props => props.theme.space[1]};
`

const Name = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: 0.0125rem;
  font-size: ${props => props.theme.fontSizes[2]};
  font-weight: 700;
`

function PlayerAvatar(props: PlayerAvatarProps) {
  const { name, level, stats, artwork } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <div>
      <Portrait artwork={artwork} />

      <Stats>
        <Name>{name}</Name>

        <Stat>Level {level}</Stat>

        <Stat>{hitPoints} HP</Stat>
      </Stats>
    </div>
  )
}

export default PlayerAvatar
