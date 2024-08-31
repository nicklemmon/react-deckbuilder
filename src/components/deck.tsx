import React from 'react'
import { clsx } from 'clsx'
import { EmptyDeck } from './empty-deck'
import css from './deck.module.css'

export function Deck({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className={clsx({
        [css['deck']]: true,
      })}
    >
      {React.Children.count(children) === 0 ? (
        <EmptyDeck />
      ) : (
        React.Children.map(children, (child, index) => {
          return (
            <div
              key={`deck-child${index}`}
              style={{ position: 'absolute', left: `-${index * 5}px`, top: '0', zIndex: index }}
            >
              {child}
            </div>
          )
        })
      )}
    </div>
  )
}
