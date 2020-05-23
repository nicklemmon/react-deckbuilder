import React from 'react'
import styled from 'styled-components'

interface PlayerAvatar {
  name: string
  level: number
  stats: {
    hitPoints: number
    attack: number
    defense: number
  }
}

const Wrapper = styled.div`
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
`

const Name = styled.div`
  font-weight: 700;
`

function PlayerAvatar(props: PlayerAvatar) {
  const { name, level, stats } = props

  return (
    <Wrapper>
      <div>
        <Name>{name}</Name>

        <div>Level {level}</div>

        <div>{stats.hitPoints} HP</div>
      </div>
    </Wrapper>
  )
}

export default PlayerAvatar
