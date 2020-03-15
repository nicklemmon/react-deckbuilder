import React from 'react'
import styled from 'styled-components'
import { default as MonsterInterface } from '../../interfaces/Monster'

const StyledMonster = styled('div')`
  background-color: pink;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  height: 17.5rem;
  width: 11.25rem;
`

function Monster(props: MonsterInterface) {
  const { name, level, id, stats } = props

  return (
    <StyledMonster>
      <h3>{name}</h3>

      <div>Level {level}</div>

      <div>
        <strong>{stats.hitPoints}</strong> HP
      </div>
    </StyledMonster>
  )
}

export default Monster
