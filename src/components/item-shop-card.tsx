import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import type { Card as CardType } from '../types/cards'
import { PriceStatsRow } from './price-stats-row'
import { Card } from './card'
import css from './item-shop-card.module.css'

export type ItemShopCardStatus = 'affordable' | 'unaffordable' | 'purchased'

export function ItemShopCard({
  className,
  shopStatus,
  onClick,
  ...props
}: {
  shopStatus: ItemShopCardStatus
  onClick: () => void
  className?: string
} & CardType) {
  const disabled = shopStatus === 'unaffordable' || shopStatus === 'purchased'

  const withClsx = (rootClass: string, className?: string) => {
    return clsx(
      {
        [rootClass]: true,
        [css['purchased']]: shopStatus === 'purchased',
        [css['unaffordable']]: shopStatus === 'unaffordable',
        [css['affordable']]: shopStatus === 'affordable',
      },
      className,
    )
  }

  /** Handle clicks, bailing when the card is disabled */
  const handleClick = () => {
    if (disabled) return

    if (!onClick) return

    return onClick()
  }

  return (
    <div className={withClsx(css['item-shop-card'], className)} onClick={handleClick}>
      <AnimatePresence>
        {shopStatus === 'purchased' ? (
          <motion.div
            className={css['item-shop-card-overlay']}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            <motion.span
              className={css['item-shop-card-purchased-text']}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Purchased!
            </motion.span>
          </motion.div>
        ) : null}

        {shopStatus === 'unaffordable' ? (
          <motion.div
            className={css['item-shop-card-overlay']}
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            <motion.span
              className={css['item-shop-card-unaffordable-text']}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Unaffordable
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Card
        className={withClsx(css['item-shop-card-card'])}
        status={disabled ? 'disabled' : 'idle'}
        {...props}
      />

      <PriceStatsRow price={props.price} />
    </div>
  )
}
