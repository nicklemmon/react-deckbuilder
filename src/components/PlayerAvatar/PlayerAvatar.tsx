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
  background: tomato;
  height: 10rem;
  width: 10rem;
  padding: 1rem;
`

function PlayerAvatar(props: PlayerAvatar) {
  const { name, level, stats } = props

  return (
    <Wrapper>
      <strong>{name}</strong>

      <div>Level {level}</div>

      <div>{stats.hitPoints} HP</div>
    </Wrapper>
  )
}

export default PlayerAvatar
