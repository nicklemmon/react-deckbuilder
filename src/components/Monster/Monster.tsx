import React from 'react'
import styled from 'styled-components'
import { default as MonsterInterface } from '../../interfaces/Monster'

const Wrapper = styled('div')`
  background: pink;
  height: 10rem;
  width: 10rem;
  padding: 1rem;
`

const Header = styled('div')`
  font-weight: 700;
`

function Monster(props: MonsterInterface) {
  const { name, level, id, stats } = props
  const hitPoints = stats.hitPoints < 0 ? 0 : stats.hitPoints

  return (
    <Wrapper id={id}>
      <Header>
        <h3>{name}</h3>
      </Header>

      <div>Level {level}</div>

      <div>
        <strong>{hitPoints}</strong> HP
      </div>
    </Wrapper>
  )
}

export default Monster
