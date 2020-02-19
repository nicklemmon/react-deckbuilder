import React, { useState, useEffect } from 'react'
import config from './config'
import shuffle from './functions/shuffle'
import { Deck } from './components/Deck'
import { PlayArea } from './components/PlayArea'
import { Card } from './components/Card'
import CardInterface from './interfaces/Card'

export default function App() {
  const { cards } = config
  const [hand, setHand] = useState()

  useEffect(() => {
    setHand(shuffle(cards))
  }, [])

  return (
    <>
      <header>Deck Builder!</header>

      <main>
        <PlayArea>
          <Deck>
            <>
              {hand &&
                hand.map((card: CardInterface, index: number) => (
                  <Card key={`card-${index}`} {...card} />
                ))}
            </>
          </Deck>
        </PlayArea>
      </main>

      <footer></footer>
    </>
  )
}
