import styled from 'styled-components'

const padding = '2rem'
const monsterLayer = 0
const cardsLayer = 1
const playLayer = 2

export const PlayAreaWrapper = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
`

export const PlayerDeckWrapper = styled.div<{ numberOfCards: number }>`
  position: absolute;
  top: ${() => padding};
  left: ${() => padding};
  z-index: ${() => cardsLayer};
`

export const DrawPileWrapper = styled.div`
  position: absolute;
  top: ${() => padding};
  right: ${() => padding};
  z-index: ${() => cardsLayer};
`

export const DiscardPileWrapper = styled.div`
  position: absolute;
  bottom: ${() => padding};
  right: ${() => padding};
  z-index: ${() => cardsLayer};
`

export const CurrentHandWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: ${() => padding};
  z-index: ${() => playLayer};
`

export const BattleWrapper = styled.div`
  position: absolute;
  left: 50%;
  margin: 0 auto;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  z-index: ${() => monsterLayer};
  transform: translateX(-50%) translateY(-12.5%);
`

export const CardInPlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: ${() => playLayer};
`

export const Feedback = styled.div`
  background-color: navy;
  color: white;
  padding: 1rem;
  position: absolute;
  margin: 0 auto;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
`
