import React from 'react'
import styled from 'styled-components'
import { useGameMachine } from 'src/GameMachineContext'
import { Modal } from 'src/components/Modal'
import { Card } from 'src/components/Card'
import CardInterface from 'src/interfaces/Card'
import { Deck } from 'src/components/Deck'
import { Button } from 'src/components/Button'

const DeckWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export default function ShoppingModal() {
  const [state, send] = useGameMachine()
  const { itemShop } = state.context

  return (
    <Modal>
      <Modal.Content>
        <DeckWrapper>
          <Deck isStacked={false}>
            {itemShop &&
              itemShop.cards.map((card: CardInterface, index: number) => {
                return (
                  <Card
                    {...card}
                    key={`item-shop-card-${card.id}-${index}`}
                    cardIndex={index}
                    isDisabled={card.isDisabled}
                    isRevealed={true}
                    onClick={() => send({ type: 'NEW_CARD_CLICK', data: { card } })}
                  />
                )
              })}
          </Deck>
        </DeckWrapper>
      </Modal.Content>

      <Modal.ButtonRow>
        <Button variant="primary" onClick={() => send('NEXT_BATTLE_CLICK')}>
          Next Battle
        </Button>

        <Button
          style={{ marginLeft: '1rem' }}
          variant="secondary"
          onClick={() => send('NEVERMIND_CLICK')}
        >
          Nevermind
        </Button>
      </Modal.ButtonRow>
    </Modal>
  )
}
