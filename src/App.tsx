import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { PlayArea } from './components/PlayArea'

const GlobalStyles = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
  }
`

export default function App() {
  return (
    <>
      <GlobalStyles />
      <PlayArea />
    </>
  )
}
