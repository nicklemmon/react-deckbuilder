import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { PlayArea } from 'src/components/PlayArea'
import GameMachineProvider from 'src/GameMachineContext'
import theme from './styles/theme'

const GlobalStyles = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html {
    margin: 0;
    font-family: sans-serif;
    font-size: 16px;
  }
`

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <GameMachineProvider>
        <PlayArea />
      </GameMachineProvider>
    </ThemeProvider>
  )
}
