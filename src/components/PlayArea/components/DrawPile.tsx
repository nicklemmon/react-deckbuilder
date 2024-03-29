import { Deck } from '../../Deck'
import { Card } from '../../Card'
import { Card as CardInterface, CardStatus } from '../../../interfaces'

interface DrawPileProps {
  state: any // TODO: Implement real type
}

export function DrawPile(props: DrawPileProps) {
  const { state } = props

  return (
    <Deck isStacked={true} align="right">
      {state.context.drawPile.map((card: CardInterface, index: number) => {
        return (
          <Card
            {...card}
            cardIndex={index}
            key={`draw-pile-card-${index}`}
            status={CardStatus['face-down']}
          />
        )
      })}
    </Deck>
  )
}
