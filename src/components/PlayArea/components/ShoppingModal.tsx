import styled from 'styled-components'
import type { Card as CardInterface, Item as ItemInterface } from 'src/interfaces'
import type { ItemShop } from 'src/machines/playArea/types'
import { Card, Deck, Item, Modal, Stack } from 'src/components'
import { Button, ButtonVariant } from 'src/components/Button'

interface ShoppingModalProps {
  itemShop: ItemShop
  onNewCardClick: (card: CardInterface) => void
  onNewItemClick: (item: ItemInterface) => void
  onLeaveShopClick: () => void
  onNextBattleClick: () => void
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
  const { itemShop, onNewCardClick, onNewItemClick, onNextBattleClick, onLeaveShopClick } = props

  return (
    <Modal>
      <Modal.Content>
        <Stack>
          <DeckWrapper>
            <Deck isStacked={false}>
              {itemShop.cards.map((card: CardInterface, index: number) => {
                return (
                  <Card
                    {...card}
                    key={card.id}
                    cardIndex={index}
                    onClick={() => onNewCardClick(card)}
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
                  {...item}
                  key={key}
                  itemIndex={index}
                  status={item.status}
                  onClick={() => onNewItemClick(item)}
                />
              )
            })}
          </ItemsWrapper>
        </Stack>
      </Modal.Content>

      <Modal.ButtonRow>
        <Button variant={ButtonVariant['primary']} onClick={onNextBattleClick}>
          Next Battle
        </Button>

        <Button
          variant={ButtonVariant['secondary']}
          onClick={onLeaveShopClick}
        >
          Leave Shop
        </Button>
      </Modal.ButtonRow>
    </Modal>
  )
}
