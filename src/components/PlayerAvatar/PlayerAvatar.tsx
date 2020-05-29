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

const Wrapper = styled.div<{ artwork?: string }>`
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
`

const Name = styled.div`
  font-weight: 700;
`

function PlayerAvatar(props: PlayerAvatarProps) {
  const { name, level, stats, artwork } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <Wrapper artwork={artwork}>
      <div>
        <Name>{name}</Name>

        <div>Level {level}</div>

        <div>{hitPoints} HP</div>
      </div>
    </Wrapper>
  )
}

export default PlayerAvatar
