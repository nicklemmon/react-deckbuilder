import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { PriceStatsRow } from './price-stats-row'
import type { Item } from '../types/items'
import css from './item-shop-item.module.css'

export type ItemShopItemStatus = 'affordable' | 'unaffordable'

export function ItemShopItem({
  className,
  item,
  shopStatus,
  onClick,
}: {
  shopStatus: ItemShopItemStatus
  item: Item
  onClick: () => void
  className?: string
}) {
  const withClsx = (rootClass: string, className?: string) => {
    return clsx(
      {
        [rootClass]: true,
        [css['unaffordable']]: shopStatus === 'unaffordable',
        [css['affordable']]: shopStatus === 'affordable',
      },
      className,
    )
  }

  const handleClick = () => {
    if (!onClick) return

    if (shopStatus == 'unaffordable') return

    return onClick()
  }

  console.log('item', item)

  return (
    <div className={withClsx(css['item-shop-item'], className)}>
      <AnimatePresence>
        {shopStatus === 'unaffordable' ? (
          <motion.div
            key={`item-shop-item-overlay-${item.id}`}
            className={css['item-shop-item-overlay']}
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: 1, scale: 1.0 }}
            transition={{ delay: 0.2, duration: 0.2, scale: 1.0 }}
          >
            <motion.span
              className={css['item-shop-item-unaffordable-text']}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Unaffordable
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button className={withClsx(css['item-shop-item-btn'])} onClick={handleClick}>
        <img src={item.artwork} />
      </button>

      <PriceStatsRow price={item.cost} />
    </div>
  )
}
