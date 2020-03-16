import React from 'react'
import styled from 'styled-components'
import { PlayArea } from './components/PlayArea'

const Header = styled('header')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background-color: #f7f7f7;
`

export default function App() {
  return (
    <>
      <Header>Deck Builder!</Header>

      <main>
        <PlayArea />
      </main>

      <footer></footer>
    </>
  )
}
