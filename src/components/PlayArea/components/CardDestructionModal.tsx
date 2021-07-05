import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
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

const CardGridCell = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DestroyableCard = styled(Card)`
  transform: unset;
  float: unset;
  margin-bottom: ${props => props.theme.space[3]};
`

interface CardDestructionModalProps {
  playerDeck: DeckInterface
  onDestroyClick: (card: CardInterface) => void
  onCancelClick: () => void
  disabled?: boolean
}

export function CardDestructionModal({
  playerDeck,
  onDestroyClick,
  onCancelClick,
  disabled,
}: CardDestructionModalProps) {
  return (
    <Modal>
      <Modal.Header></Modal.Header>

      <Modal.Content scrollable>
        <CardGrid numberOfCards={playerDeck.length}>
          <AnimatePresence>
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
          </AnimatePresence>
        </CardGrid>
      </Modal.Content>

      <Modal.ButtonRow>
        <Button variant={ButtonVariant['secondary']} onClick={onCancelClick}>
          Done
        </Button>
      </Modal.ButtonRow>
    </Modal>
  )
}
