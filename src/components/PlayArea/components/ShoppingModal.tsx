import React from 'react'
import styled from 'styled-components'
import { Card as CardInterface, Item as ItemInterface } from 'src/interfaces'
import { Card, Deck, Item, Modal, Stack } from 'src/components'
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

const ItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > * + * {
    margin-left: 1rem;
  }
`

export function ShoppingModal(props: ShoppingModalProps) {
  const { state, send } = props
  const { itemShop } = state.context

  return (
    <Modal>
      <Modal.Content>
        <Stack>
          <DeckWrapper>
            <Deck isStacked={false}>
              {itemShop.cards.map((card: CardInterface, index: number) => {
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

          <ItemsWrapper>
            {itemShop.items.map((item: ItemInterface, index: number) => {
              const key = `item-shop-item-${item.id}-${index}`

              return (
                <Item
                  key={key}
                  {...item}
                  itemIndex={index}
                  onClick={() => send({ type: 'NEW_ITEM_CLICK', item })}
                />
              )
            })}
          </ItemsWrapper>
        </Stack>
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
