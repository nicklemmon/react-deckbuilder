import Card from '../interfaces/Card'

export default function shuffle(cards: Array<object>) {
  let cardsArr = cards

  for (var i = cardsArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = cardsArr[i]
    cardsArr[i] = cardsArr[j]
    cardsArr[j] = temp
  }

  return cardsArr
}
