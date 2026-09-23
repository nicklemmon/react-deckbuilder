import { createActor, fromPromise, waitFor } from 'xstate'
import { describe, expect, it } from 'vitest'
import { appMachine } from '../app-machine'
import { getAllItems } from '../../../helpers/item'

describe('appMachine', () => {
  /** Starts the machine in a shop state with a controlled player balance and deck. */
  async function actorIn(state: 'Shopping' | 'DestroyingCards', gold: number, deckSize = 1) {
    const machine = appMachine.provide({
      actors: { loadAllAssets: fromPromise<unknown[]>(async () => []) },
    })
    const initialActor = createActor(machine).start()
    await waitFor(initialActor, (snapshot) => snapshot.matches('TitleScreen'))
    const context = initialActor.getSnapshot().context
    initialActor.stop()

    const card = { ...context.assets.cards[0]!, id: 'offer-card', price: 30 }
    const item = getAllItems()[0]!
    const snapshot = machine.resolveState({
      value: state,
      context: {
        ...context,
        game: {
          ...context.game,
          player: {
            ...context.game.player,
            gold,
            deck:
              state === 'Shopping'
                ? [{ ...card, id: 'owned-card' }]
                : Array.from({ length: deckSize }, (_, index) => ({
                    ...card,
                    id: index === 0 ? card.id : `owned-card-${index}`,
                  })),
          },
          shop: { cards: [card], items: [item] },
          items: [item],
        },
      },
    })
    return { actor: createActor(machine, { snapshot }).start(), card, item }
  }

  it('rejects unavailable card and item purchases', async () => {
    const { actor, card, item } = await actorIn('Shopping', 0)

    actor.send({ type: 'ITEM_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    expect(actor.getSnapshot().context.game.player.deck).toHaveLength(1)

    actor.send({ type: 'ITEM_SHOP_ITEM_CLICK', data: { item } })
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    expect(actor.getSnapshot().context.game.player.inventory).toHaveLength(0)
    actor.stop()
  })

  it('allows an exact-price card purchase only once', async () => {
    const { actor, card } = await actorIn('Shopping', 30)
    actor.send({ type: 'ITEM_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    expect(actor.getSnapshot().context.game.player.deck).toHaveLength(2)

    actor.send({ type: 'ITEM_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    expect(actor.getSnapshot().context.game.player.deck).toHaveLength(2)
    actor.stop()
  })

  it('allows an exact-price item purchase', async () => {
    const { actor, item } = await actorIn('Shopping', getAllItems()[0]!.cost)
    actor.send({ type: 'ITEM_SHOP_ITEM_CLICK', data: { item } })
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    expect(actor.getSnapshot().context.game.player.inventory).toHaveLength(1)
    actor.stop()
  })

  it('rejects card destruction when gold is insufficient', async () => {
    const { actor, card } = await actorIn('DestroyingCards', 30, 2)
    actor.send({ type: 'DESTRUCTION_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().matches('DestroyingCards')).toBe(true)
    expect(actor.getSnapshot().context.game.player.deck).toHaveLength(2)
    expect(actor.getSnapshot().context.game.player.gold).toBe(30)
    actor.stop()
  })

  it('keeps the final card so the next battle remains playable', async () => {
    const { actor, card } = await actorIn('DestroyingCards', 100)
    actor.send({ type: 'DESTRUCTION_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().matches('DestroyingCards')).toBe(true)
    expect(actor.getSnapshot().context.game.player.deck).toHaveLength(1)
    actor.stop()
  })

  it('destroys an owned card when the player can pay and has another card', async () => {
    const { actor, card } = await actorIn('DestroyingCards', 100, 2)
    actor.send({ type: 'DESTRUCTION_SHOP_CARD_CLICK', data: { card } })
    expect(actor.getSnapshot().matches('DestroyingCard')).toBe(true)
    expect(actor.getSnapshot().context.game.player.deck.map((owned) => owned.id)).toEqual([
      'owned-card-1',
    ])
    expect(actor.getSnapshot().context.game.player.gold).toBe(0)
    actor.stop()
  })
  it('loads shop items after creating a character', async () => {
    const machine = appMachine.provide({
      actors: {
        loadAllAssets: fromPromise<unknown[]>(async () => []),
      },
    })
    const actor = createActor(machine)
    actor.start()
    await waitFor(actor, (snapshot) => snapshot.matches('TitleScreen'))

    const characterClass = actor.getSnapshot().context.assets.characterClasses[0]
    const portrait = actor.getSnapshot().context.assets.playerPortraits[0]
    expect(characterClass).toBeDefined()
    expect(portrait).toBeDefined()
    if (!characterClass || !portrait) throw new Error('Expected character creation assets')

    actor.send({ type: 'TITLE_SCREEN_START_CLICK' })
    actor.send({ type: 'STANDARD_MODE_SELECTION' })
    actor.send({
      type: 'CREATE_CHARACTER',
      data: {
        characterClass: characterClass.id,
        characterName: 'Test player',
        characterPortrait: portrait.url,
      },
    })

    expect(actor.getSnapshot().context.game.items.map((item) => item.id)).toContain('small-potion')
    actor.stop()
  })
})
