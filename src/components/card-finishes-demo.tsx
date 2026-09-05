import { useState } from 'react'
import { CARDS, requireCard } from '../helpers/cards'
import { Card } from './card'
import { CARD_FINISH_DEFAULTS, type CardFinish } from './card-finish'
import css from './card-finishes-demo.module.css'

const finishes: { finish: CardFinish; name: string; description: string }[] = [
  {
    finish: 'none',
    name: 'Original',
    description: 'The familiar card. A reference for every finish.',
  },
  {
    finish: 'foil',
    name: 'Etched foil',
    description: 'Faceted silver catches the light as you move.',
  },
  {
    finish: 'prismatic',
    name: 'Prismatic',
    description: 'A full spectrum wrapped around the point of light.',
  },
  {
    finish: 'gold',
    name: 'Gilded',
    description: 'Warm metallic bands for something worth keeping.',
  },
  {
    finish: 'ember',
    name: 'Ember',
    description: 'A glowing base with a steady drift of rising sparks.',
  },
]

export function CardFinishesDemo() {
  const [cardId, setCardId] = useState('firebolt')
  const [strengths, setStrengths] = useState({ ...CARD_FINISH_DEFAULTS })
  const [animated, setAnimated] = useState(true)
  const card = requireCard(cardId, CARDS)

  return (
    <main className={css['demo']}>
      <div className={css['container']}>
        <header className={css['header']}>
          <a href="/">← Back to game</a>
          <p className={css['eyebrow']}>THE ARTIFICER’S TABLE / EXPERIMENT 01</p>
          <h1>One card. Five identities.</h1>
          <p className={css['intro']}>
            A collection of enchanted finishes. Move over the cards to catch the light, then try a
            different spell or turn up the shine.
          </p>
        </header>

        <section className={css['controls']} aria-label="Finish controls">
          <label>
            Card artwork
            <select value={cardId} onChange={(event) => setCardId(event.target.value)}>
              {CARDS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className={css['reset']}
            onClick={() => setStrengths({ ...CARD_FINISH_DEFAULTS })}
          >
            Reset all strengths
          </button>
          <label className={css['toggle']}>
            <input
              type="checkbox"
              checked={animated}
              onChange={(event) => setAnimated(event.target.checked)}
            />
            Animate light
          </label>
        </section>

        <section className={css['gallery']} aria-label="Card finish gallery">
          {finishes.map(({ finish, name, description }, index) => (
            <article className={css['sample']} key={finish}>
              <div className={css['stage']}>
                <Card
                  {...card}
                  id={`demo-${finish}`}
                  finish={finish}
                  finishIntensity={strengths[finish]}
                  finishAnimated={animated}
                />
              </div>
              <div className={css['caption']}>
                <span className={css['number']}>0{index + 1}</span>
                <div>
                  <h2>{name}</h2>
                  <p>{description}</p>
                  {finish !== 'none' && (
                    <label className={css['strength']}>
                      {name} strength · {Math.round(strengths[finish] * 100)}%
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={strengths[finish]}
                        onChange={(event) =>
                          setStrengths({ ...strengths, [finish]: Number(event.target.value) })
                        }
                      />
                      <span>Default: {Math.round(CARD_FINISH_DEFAULTS[finish] * 100)}%</span>
                    </label>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
        <footer className={css['footer']}>
          CSS finish studies · Original game artwork · Reduced motion supported
        </footer>
      </div>
    </main>
  )
}
