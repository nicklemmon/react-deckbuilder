import React from 'react'
import styled from 'styled-components'
import { Modal } from 'src/components/Modal'
import { Card } from 'src/components/Card'
import { Card as CardInterface } from 'src/interfaces/Card'
import { Deck } from 'src/components/Deck'
import { Button, ButtonVariant } from 'src/components/Button'

interface ShoppingModalProps {
  state: any // TODO: Implement real type
  send: any // TODO: Implement real type
}

const DeckWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export function ShoppingModal(props: ShoppingModalProps) {
  const { state, send } = props
  const { itemShop } = state.context

  return (
    <Modal>
      <Modal.Content>
        <DeckWrapper>
          <Deck isStacked={false}>
            {itemShop &&
              itemShop.cards.map((card: CardInterface, index: number) => {
                const key = `item-shop-card-${card.id}-${index}`

                return (
                  <Card
                    key={key}
                    {...card}
                    cardIndex={index}
                    isDisabled={card.isDisabled}
                    isRevealed={true}
                    overlayVariant={card.overlayVariant}
                    onClick={() => send({ type: 'NEW_CARD_CLICK', card })}
                    showPrice={true}
                  />
                )
              })}
          </Deck>
        </DeckWrapper>
      </Modal.Content>

      <Modal.ButtonRow>
        <Button variant={ButtonVariant['primary']} onClick={() => send('NEXT_BATTLE_CLICK')}>
          Next Battle
        </Button>

        <Button
          style={{ marginLeft: '1rem' }}
          variant={ButtonVariant['secondary']}
          onClick={() => send('LEAVE_SHOP_CLICK')}
        >
          Leave Shop
        </Button>
      </Modal.ButtonRow>
    </Modal>
  )
}
