import styled from 'styled-components'
import { Card as CardInterface, CardStatus, Deck as DeckInterface } from 'src/interfaces'
import { Button, ButtonVariant, Card, GoldStat, Modal } from 'src/components'

const CardGrid = styled.div<{ numberOfCards: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.numberOfCards}, 1fr)`};
  grid-template-rows: auto;
  grid-gap: ${props => props.theme.space[3]};
  width: 100%;
  overflow-x: scroll;
`

const CardGridCell = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Empty = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const EmptyText = styled('p')`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes[2]};
`

const DestroyableCard = styled(Card)`
  transform: unset;
  float: unset;
  margin-bottom: ${props => props.theme.space[3]};
`

interface CardDestructionModalProps {
  playerDeck: DeckInterface
  onDestroyClick: (card: CardInterface) => void
  onNextBattleClick: () => void
  onCancelClick: () => void
  disabled?: boolean
}

export function CardDestructionModal({
  playerDeck,
  onDestroyClick,
  onNextBattleClick,
  onCancelClick,
  disabled,
}: CardDestructionModalProps) {
  return (
    <Modal>
      <Modal.Header />

      {playerDeck.length === 1 ? (
        <Modal.Content>
          <Empty>
            <EmptyText>Only one card left - no additional cards can be destroyed.</EmptyText>
          </Empty>
        </Modal.Content>
      ) : (
        <Modal.Content scrollable>
          <CardGrid numberOfCards={playerDeck.length}>
            {playerDeck.map((card: CardInterface, index) => {
              return (
                <CardGridCell key={card.id}>
                  <DestroyableCard {...card} status={CardStatus['face-up']} cardIndex={index} />

                  <Button
                    variant={ButtonVariant['primary']}
                    fullWidth
                    onClick={() => onDestroyClick(card)}
                    disabled={card.status === CardStatus['disabled'] || disabled}
                  >
                    Destroy <GoldStat appearance="inverted">100</GoldStat>
                  </Button>
                </CardGridCell>
              )
            })}
          </CardGrid>
        </Modal.Content>
      )}

      <Modal.ButtonRow>
        <Button variant={ButtonVariant['primary']} onClick={onNextBattleClick}>
          Next Battle
        </Button>

        <Button variant={ButtonVariant['secondary']} onClick={onCancelClick}>
          Stop Destroying
        </Button>
      </Modal.ButtonRow>
    </Modal>
  )
}
