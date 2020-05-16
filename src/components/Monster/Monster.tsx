import React from 'react'
import styled from 'styled-components'
import { default as MonsterInterface } from '../../interfaces/Monster'

const Wrapper = styled('div')`
  background-color: pink;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  height: 17.5rem;
  width: 11.25rem;
`

const Header = styled('div')`
  font-weight: 700;
`

function Monster(props: MonsterInterface) {
  const { name, level, id, stats } = props

  return (
    <Wrapper id={id}>
      <Header>
        <h3>{name}</h3>
      </Header>

      <div>Level {level}</div>

      <div>
        <strong>{stats.hitPoints}</strong> HP
      </div>
    </Wrapper>
  )
}

export default Monster
