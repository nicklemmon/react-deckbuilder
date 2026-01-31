import { assign, fromPromise, setup } from 'xstate'
import arrayShuffle from 'array-shuffle'
import impactSfx from '../../sfx/impact.slice.wav'
import cardUseSfx from '../../sfx/card.use.wav'
import buttonClickSfx from '../../sfx/button.click.wav'
import doorOpenSfx from '../../sfx/door.open.wav'
import coinsSfx from '../../sfx/coins.wav'
import cashRegisterSfx from '../../sfx/cash-register.wav'
import winSfx from '../../sfx/win.wav'
import loseSfx from '../../sfx/lose.wav'
import storeMusicSfx from '../../sfx/music/music.store.wav'
import { resolveModules, resolveModulesWithPaths } from '../../helpers/vite.ts'
import { rng } from '../../helpers/rng.ts'
import { getSound } from '../../helpers/get-sound.ts'
import { getCharacterClass } from '../../helpers/character-classes.ts'
import { getAllMonsters } from '../../helpers/monsters.ts'
import { CARDS, STARTING_DECK } from '../../helpers/cards.ts'
import { getAllItems } from '../../helpers/item.ts'
import type { CharacterClass } from '../../types/character-classes.ts'
import type { Monster } from '../../types/monsters.ts'
import type { Card } from '../../types/cards.ts'
import type { Item } from '../../types/items.ts'
import type { GameMode } from '../../types/global.ts'
import type { AvatarStatus } from '../../components/avatar.tsx'
import { fadeIn, fadeOut } from '../../helpers/fade-sound.ts'

/** Unique ID for the application machine */
const APP_MACHINE_ID = 'app'

/** THe maximum number of allowed cards in the `currentHand` */
const MAX_HAND_SIZE = 5

/** The price (in gold) of destroying a card */
const CARD_DESTRUCTION_PRICE = 100

/** All image files in the project */
const IMAGE_MODULES = import.meta.glob('../../**/*.(png|webp)', {
  eager: true,
  query: { format: 'webp' },
})

/** All sound effect files in the project */
const SFX_MODULES = import.meta.glob('../../**/*.wav', { eager: true })

/** All character class config files in the project */
const CHARACTER_CLASS_MODULES = import.meta.glob('../../character-classes/**/config.ts', {
  eager: true,
})

/** All player portrait files */
const PLAYER_PORTRAIT_MODULES = import.meta.glob('../../images/player-portraits/*.(png|webp)', {
  eager: true,
  query: { format: 'webp' },
})

/* Resolved character class configs */
const CHARACTER_CLASSES = resolveModules<CharacterClass>(CHARACTER_CLASS_MODULES)

/* Resolved player portraits with paths for game mode filtering */
const PLAYER_PORTRAITS = resolveModulesWithPaths<string>(PLAYER_PORTRAIT_MODULES)

const impactSound = getSound({ src: impactSfx })

// TODO: We really need to keep these somewhere else
export const cardUseSound = getSound({ src: cardUseSfx, volume: 0.33 })

const buttonClickSound = getSound({ src: buttonClickSfx, volume: 0.5 })

const doorOpenSound = getSound({ src: doorOpenSfx, volume: 0.5 })

const cashRegisterSound = getSound({ src: cashRegisterSfx, volume: 0.5 })

const coinsSound = getSound({ src: coinsSfx, volume: 0.7 })

const winSound = getSound({ src: winSfx })

const loseSound = getSound({ src: loseSfx })

const storeMusicSound = getSound({ src: storeMusicSfx, volume: 0.7, loop: true })

/** Prefetches assets from multiple sources returned by `import.meta.glob` */
async function prefetchAssets() {
  // Initialize helper functions to ensure all assets are discovered
  const allMonsters = getAllMonsters()
  const allItems = getAllItems()

  // Collect all assets from both glob imports and helper functions
  const allImages = new Set<string>()
  const allSounds = new Set<string>()

  // Add glob-imported images
  Object.values(IMAGE_MODULES).forEach((module: any) => {
    allImages.add(module.default)
  })

  // Add glob-imported sound effects
  Object.values(SFX_MODULES).forEach((module: any) => {
    allSounds.add(module.default)
  })

  // Add assets from cards
  CARDS.forEach((card) => {
    if (card.artwork) allImages.add(card.artwork as string)
  })

  // Add assets from monsters
  allMonsters.forEach((monster) => {
    if (monster.artwork) allImages.add(monster.artwork as string)
  })

  // Add assets from items
  allItems.forEach((item) => {
    if (item.artwork) allImages.add(item.artwork as string)
  })

  // Add player portraits
  PLAYER_PORTRAITS.forEach((portrait) => {
    allImages.add(portrait.url)
  })

  return Promise.all([
    // Preload all images
    ...Array.from(allImages).map((src) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(null)
        img.onerror = () => resolve(null) // Don't fail the entire load for missing images
      })
    }),
    // Preload all sounds
    ...Array.from(allSounds).map((src) => {
      return new Promise((resolve) => {
        const audio = new Audio()
        audio.src = src
        audio.oncanplaythrough = () => resolve(null)
        audio.onerror = () => resolve(null) // Don't fail the entire load for missing sounds
      })
    }),
  ])
}

/** Context for the app-machine */
export type AppMachineContext = {
  assets: {
    characterClasses: Array<CharacterClass>
    cards: Array<Card>
    playerPortraits: Array<{ path: string; url: string }>
  }
  game: {
    mode: GameMode
    availablePlayerPortraits: Array<{ path: string; url: string }>
    player: {
      characterClass: CharacterClass | undefined
      characterClassDeck: Array<Card>
      characterName: string | undefined
      characterPortrait: string | undefined
      deck: Array<Card>
      status: AvatarStatus
      gold: number
      inventory: Array<Item>
      stats: {
        maxHealth: number
        health: number
        defense: number
      }
    }
    shop: {
      cards: Array<Card>
      items: Array<Item>
    }
    monsters: Array<Monster>
    items: Array<Item>
    currentHand: Array<Card>
    discardPile: Array<Card>
    drawPile: Array<Card>
    cardDestructionPrice: number
    itemInPlay?: Item
    cardInPlay?: Card
    cardToDestroy?: Card
    monster?: Monster
    lastDefeatedMonster?: Monster
  }
}

type AppMachineEvent =
  | { type: 'TITLE_SCREEN_START_CLICK' }
  | { type: 'STANDARD_MODE_SELECTION' }
  | { type: 'RAINBOW_MODE_SELECTION' }
  | {
      type: 'CREATE_CHARACTER'
      data: { characterClass: string; characterName: string; characterPortrait: string }
    }
  | {
      type: 'PLAY_CARD'
      data: { card: Card }
    }
  | {
      type: 'PLAY_CARD_ANIMATION_COMPLETE'
      data: { card: Card }
    }
  | {
      type: 'USING_ITEM_ANIMATION_COMPLETE'
      data: { item: Item }
    }
  | { type: 'CARD_EFFECTS_ANIMATION_COMPLETE' }
  | { type: 'ITEM_EFFECTS_ANIMATION_COMPLETE' }
  | { type: 'CARD_DESTRUCTION_ANIMATION_COMPLETE'; data: { card: Card } }
  | { type: 'PLAY_CARD_ANIMATION_COMPLETE' }
  | { type: 'DISCARD_CARD_ANIMATION_COMPLETE' }
  | { type: 'MONSTER_DEATH_ANIMATION_COMPLETE' }
  | { type: 'MONSTER_ATTACK_ANIMATION_COMPLETE' }
  | { type: 'NEXT_BATTLE_CLICK' }
  | { type: 'ITEM_SHOP_CLICK' }
  | { type: 'DESTROY_CARDS_CLICK' }
  | { type: 'LEAVE_SHOP_CLICK' }
  | { type: 'LEAVE_DESTROYING_CARDS_CLICK' }
  | { type: 'ITEM_SHOP_CARD_CLICK'; data: { card: Card } }
  | { type: 'DESTRUCTION_SHOP_CARD_CLICK'; data: { card: Card } }
  | { type: 'ITEM_SHOP_ITEM_CLICK'; data: { item: Item } }
  | { type: 'INVENTORY_ITEM_CLICK'; data: { item: Item } }

export const appMachine = setup({
  types: {
    context: {} as AppMachineContext,
    events: {} as AppMachineEvent,
  },
  actions: {
    applyCardEffects: assign({
      game: ({ context }) => {
        context.game?.monster?.sfx?.damage.play()
        impactSound.play()

        if (!context.game.monster || !context.game.cardInPlay) {
          return context.game
        }

        return {
          ...context.game,
          monster: {
            ...context.game.monster,
            status: 'taking-damage' as const,
            stats: {
              ...context.game.monster.stats,
              health: context.game.monster?.stats.health - context.game.cardInPlay?.stats.attack,
            },
          },
        }
      },
    }),
    applyItemEffects: assign({
      game: ({ context }) => {
        if (!context.game.itemInPlay) return context.game

        context.game.itemInPlay.sfx.effect.play()

        let nextHealth = context.game.player.stats.health + context.game.itemInPlay.value

        if (nextHealth > context.game.player.stats.maxHealth) {
          nextHealth = context.game.player.stats.maxHealth
        }

        return {
          ...context.game,
          player: {
            ...context.game.player,
            stats: {
              ...context.game.player.stats,
              health: nextHealth,
            },
            status: 'healing' as const,
          },
        }
      },
    }),
    createDrawPile: assign({
      game: ({ context }) => {
        const newDrawPile = arrayShuffle(context.game.player.deck).map((card) => {
          return {
            ...card,
            orientation: 'face-down' as const,
          }
        })

        return {
          ...context.game,
          discardPile: [],
          drawPile: newDrawPile,
        }
      },
    }),
    stockShop: assign({
      game: ({ context }) => {
        if (!context.game.player.characterClass) return context.game

        const classDeck = arrayShuffle(context.game.player.characterClassDeck)
        const rngMax = classDeck.length - 1
        const cardsOnOffer = [
          classDeck[rng(rngMax)],
          classDeck[rng(rngMax)],
          classDeck[rng(rngMax)],
        ].map((card) => {
          return {
            ...card,
            id: `${card.id}-${crypto.randomUUID()}`,
          }
        })

        return {
          ...context.game,
          shop: {
            cards: cardsOnOffer,
            items: [],
          },
        }
      },
    }),
    disableUnaffordableItems: assign({
      game: ({ context }) => context.game,
    }),
    getNextMonster: assign({
      game: ({ context }) => {
        const shuffledMonsters = arrayShuffle(context.game.monsters)
        const nextMonster = shuffledMonsters[rng(shuffledMonsters.length)]

        nextMonster.sfx?.intro.play()

        return {
          ...context.game,
          monster: {
            ...nextMonster,
            id: `${nextMonster.id}-${crypto.randomUUID()}`,
            stats: {
              ...nextMonster.stats,
              health: nextMonster.stats.maxHealth,
            },
            status: 'idle' as const,
          },
        }
      },
    }),
    reshuffle: assign({
      game: ({ context }) => {
        const nextDrawPile = arrayShuffle([
          ...context.game.currentHand,
          ...context.game.discardPile,
        ])

        return {
          ...context.game,
          currentHand: [],
          discardPile: [],
          drawPile: nextDrawPile,
        }
      },
    }),
    /** Draws a hand of cards from the draw pile */
    drawHand: assign({
      game: ({ context }) => {
        const drawPile = context.game.drawPile
        const currentHandSize = context.game.currentHand.length

        // Draw up to 3 cards, but stop if we hit the max hand size
        const cardsToDrawCount = Math.min(3, MAX_HAND_SIZE - currentHandSize)
        const drawnCards = drawPile.slice(0, cardsToDrawCount)
        const remainingCards = drawPile.slice(cardsToDrawCount)

        for (const _card of drawnCards) {
          cardUseSound.play()
        }

        return {
          ...context.game,
          currentHand: [
            ...context.game.currentHand,
            ...drawnCards.map((card) => {
              return {
                ...card,
                orientation: 'face-up' as const,
              }
            }),
          ],
          drawPile: remainingCards,
        }
      },
    }),
    /** Discards the player's current hand */
    discardCurrentHand: assign({
      game: ({ context }) => {
        return {
          ...context.game,
          currentHand: [],
        }
      },
    }),
    /** The monster attacks the player */
    monsterAttack: assign({
      game: ({ context }) => {
        if (!context.game.monster) return context.game

        const rawDamage = context.game.monster.stats.attack - context.game.player.stats.defense
        const damage = rawDamage > 0 ? rawDamage : 0
        impactSound.play()

        return {
          ...context.game,
          player: {
            ...context.game.player,
            status: 'taking-damage' as const,
            stats: {
              ...context.game.player.stats,
              health: context.game.player.stats.health - damage,
            },
          },
        }
      },
    }),
    /** Awards the player with the spoils of war */
    awardSpoils: assign({
      game: ({ context }) => {
        const lastDefeatedMonster = context.game.lastDefeatedMonster

        if (!lastDefeatedMonster) return context.game

        coinsSound.play()

        return {
          ...context.game,
          player: {
            ...context.game.player,
            gold: context.game.player.gold + lastDefeatedMonster.goldBounty,
          },
        }
      },
    }),
  },
  actors: {
    loadAllAssets: fromPromise(prefetchAssets),
  },
  guards: {
    playerIsAlive: ({ context }) => {
      return context.game.player.stats.health > 0
    },
    playerIsDead: ({ context }) => {
      return context.game.player.stats.health <= 0
    },
    monsterIsAlive: ({ context }) => {
      if (!context.game.monster) return false

      return context.game.monster.stats.health > 0
    },
    monsterIsDead: ({ context }) => {
      if (!context.game.monster) return false

      return context.game.monster.stats.health <= 0
    },
    playerCanDraw: ({ context }) => {
      return context.game.drawPile.length > 0 && context.game.currentHand.length < MAX_HAND_SIZE
    },
    playerCannotDraw: ({ context }) => {
      return context.game.drawPile.length === 0 && context.game.currentHand.length < MAX_HAND_SIZE
    },
    drawingNotNeeded: ({ context }) => {
      return context.game.drawPile.length === 0 && context.game.currentHand.length === MAX_HAND_SIZE
    },
  },
}).createMachine({
  id: APP_MACHINE_ID,
  initial: 'LoadingAssets',
  context: {
    assets: {
      characterClasses: CHARACTER_CLASSES,
      cards: CARDS,
      playerPortraits: PLAYER_PORTRAITS,
    },
    game: {
      mode: 'standard',
      availablePlayerPortraits: [],
      player: {
        characterClass: undefined,
        characterClassDeck: [],
        characterName: undefined,
        characterPortrait: undefined,
        deck: STARTING_DECK.map((card) => {
          return {
            ...card,
            // Create a unique identifier for every card in the game
            id: `${card.id}-${crypto.randomUUID()}`,
          }
        }),
        gold: 125,
        status: 'idle' as const,
        stats: {
          // TODO: Update with character class stats
          maxHealth: 100,
          health: 100,
          defense: 0,
        },
        inventory: [],
      },
      monsters: [],
      items: [],
      shop: {
        cards: [],
        items: [],
      },
      cardDestructionPrice: CARD_DESTRUCTION_PRICE,
      currentHand: [],
      discardPile: [],
      drawPile: [],
    },
  },
  states: {
    LoadingAssets: {
      invoke: {
        src: 'loadAllAssets',
        onDone: 'TitleScreen',
        onError: 'LoadingAssetsError',
      },
    },
    LoadingAssetsError: {},
    TitleScreen: {
      on: {
        TITLE_SCREEN_START_CLICK: {
          target: 'ModeSelection',
          actions: () => buttonClickSound.play(),
        },
      },
    },
    ModeSelection: {
      on: {
        STANDARD_MODE_SELECTION: {
          actions: assign({
            game: ({ context }) => {
              const mode = 'standard'
              return {
                ...context.game,
                mode,
                availablePlayerPortraits: context.assets.playerPortraits.filter((portrait) =>
                  portrait.path.includes(`.${mode}.`),
                ),
              }
            },
          }),
          target: 'CharacterCreation',
        },
        RAINBOW_MODE_SELECTION: {
          actions: assign({
            game: ({ context }) => {
              const mode = 'rainbow'
              return {
                ...context.game,
                mode,
                availablePlayerPortraits: context.assets.playerPortraits.filter((portrait) =>
                  portrait.path.includes(`.${mode}.`),
                ),
              }
            },
          }),
          target: 'CharacterCreation',
        },
      },
    },
    CharacterCreation: {
      on: {
        CREATE_CHARACTER: {
          target: 'NewRound',
          actions: assign({
            game: (args) => {
              const { context, event } = args
              const characterClass = getCharacterClass(event.data.characterClass, CHARACTER_CLASSES)

              if (!characterClass) return context.game

              return {
                ...context.game,
                items: getAllItems(),
                monsters: getAllMonsters().filter((monster) => {
                  // We only want the monsters for the currently selected mode
                  return monster.gameMode === context.game.mode
                }),
                player: {
                  ...context.game.player,
                  characterClass: characterClass,
                  characterName: event.data.characterName,
                  characterPortrait: event.data.characterPortrait,
                  characterClassDeck: characterClass.deck,
                },
              }
            },
          }),
        },
      },
    },
    NewRound: {
      tags: ['gameplay'],
      entry: ['discardCurrentHand', 'getNextMonster', 'createDrawPile'],
      always: ['Surveying'],
    },
    Surveying: {
      tags: ['gameplay'],
      // Resets player status to idle
      entry: assign({
        game: ({ context }) => ({
          ...context.game,
          player: { ...context.game.player, status: 'idle' as const },
        }),
      }),
      always: [
        {
          target: 'PlayerChoosing',
          guard: 'drawingNotNeeded',
        },
        {
          target: 'Drawing',
          guard: 'playerCanDraw',
        },
        {
          target: 'Reshuffling',
          guard: 'playerCannotDraw',
        },
      ],
    },
    Reshuffling: {
      tags: ['gameplay'],
      entry: 'reshuffle',
      always: 'Drawing',
    },
    Drawing: {
      tags: ['gameplay'],
      entry: ['drawHand'],
      always: 'PlayerChoosing',
    },
    PlayerChoosing: {
      tags: ['gameplay'],
      on: {
        PLAY_CARD: {
          target: 'CardInPlay',
          actions: assign({
            game: ({ context, event }) => {
              cardUseSound.play()

              // TODO: Need to have a slight delay here
              event.data.card?.sfx?.play()

              return {
                ...context.game,
                // Remove the selected card from the current hand
                currentHand: context.game.currentHand.filter(
                  (card) => card.id !== event.data.card.id,
                ),
                cardInPlay: {
                  ...event.data.card,
                  orientation: 'face-up' as const,
                  status: 'in-play' as const,
                },
              }
            },
          }),
        },
        INVENTORY_ITEM_CLICK: {
          target: 'UsingItem',
          actions: assign({
            game: ({ context, event }) => {
              const itemInPlay = event.data.item

              itemInPlay.sfx.use.play()

              return {
                ...context.game,
                itemInPlay,
                player: {
                  ...context.game.player,
                  inventory: context.game.player.inventory.filter((item) => {
                    return item.id !== itemInPlay.id
                  }),
                },
              }
            },
          }),
        },
      },
      entry: assign({
        game: ({ context }) => {
          if (!context.game.monster) {
            return context.game
          }

          return {
            ...context.game,
            monster: {
              ...context.game.monster,
              status: 'idle' as const,
            },
          }
        },
      }),
    },
    CardInPlay: {
      tags: ['gameplay'],
      on: {
        PLAY_CARD_ANIMATION_COMPLETE: {
          target: 'ApplyingCardEffects',
        },
      },
    },
    UsingItem: {
      tags: ['gameplay'],
      on: {
        USING_ITEM_ANIMATION_COMPLETE: {
          target: 'ApplyingItemEffects',
        },
      },
    },
    ApplyingCardEffects: {
      tags: ['gameplay'],
      entry: 'applyCardEffects',
      on: {
        CARD_EFFECTS_ANIMATION_COMPLETE: {
          target: 'CardPlayed',
        },
      },
    },
    ApplyingItemEffects: {
      tags: ['gameplay'],
      entry: 'applyItemEffects',
      on: {
        ITEM_EFFECTS_ANIMATION_COMPLETE: {
          target: 'PlayerChoosing',
        },
      },
    },
    CardPlayed: {
      tags: ['gameplay'],
      entry: assign({
        game: ({ context }) => {
          // Should be an impossible state, but need to keep TypeScript happy
          if (!context.game.monster) {
            return {
              ...context.game,
              cardInPlay: undefined,
              discardPile: [
                ...context.game.discardPile,
                {
                  ...(context.game?.cardInPlay as Card),
                  status: 'idle',
                },
              ],
            }
          }

          return {
            ...context.game,
            cardInPlay: undefined,
            monster: {
              ...context.game.monster,
              status: 'idle' as const,
            },
            discardPile: [
              ...context.game.discardPile,
              {
                ...(context.game?.cardInPlay as Card),
                status: 'idle',
              },
            ],
          }
        },
      }),
      always: [
        {
          target: 'Victory',
          guard: 'monsterIsDead',
          actions: assign({
            game: ({ context }) => {
              // Should be an impossible state, but need to keep TypeScript happy
              if (!context.game.monster) {
                return context.game
              }

              context.game.monster.sfx?.death.play()

              return {
                ...context.game,
                lastDefeatedMonster: context.game.monster,
                monster: undefined,
              }
            },
          }),
        },
        {
          target: 'Defending',
          guard: 'monsterIsAlive',
        },
      ],
    },
    Defending: {
      tags: ['gameplay'],
      entry: 'monsterAttack',
      on: {
        MONSTER_ATTACK_ANIMATION_COMPLETE: [
          {
            target: 'Surveying',
            guard: 'playerIsAlive',
          },
          {
            target: 'Defeat',
            guard: 'playerIsDead',
          },
        ],
      },
    },
    Victory: {
      tags: ['gameplay'],
      entry: ['stockShop'],
      exit: () => {
        winSound.play()
      },
      on: {
        MONSTER_DEATH_ANIMATION_COMPLETE: {
          actions: ['awardSpoils'],
          target: 'BetweenRounds',
        },
      },
    },
    BetweenRounds: {
      tags: ['gameplay'],
      on: {
        NEXT_BATTLE_CLICK: {
          target: 'NewRound',
          actions: () => buttonClickSound.play(),
        },
        ITEM_SHOP_CLICK: {
          target: 'Shopping',
          actions: () => buttonClickSound.play(),
        },
        DESTROY_CARDS_CLICK: {
          target: 'DestroyingCards',
          actions: () => buttonClickSound.play(),
        },
      },
    },
    Shopping: {
      tags: ['gameplay'],
      entry: [
        'disableUnaffordableItems',
        () => {
          doorOpenSound.play()
          fadeIn(storeMusicSound) // TODO: How do I loop this?
        },
      ],
      on: {
        LEAVE_SHOP_CLICK: {
          target: 'BetweenRounds',
          actions: () => {
            buttonClickSound.play()
            fadeOut(storeMusicSound)
          },
        },
        ITEM_SHOP_CARD_CLICK: {
          target: 'Shopping',
          actions: assign({
            game: ({ context, event }) => {
              buttonClickSound.play()
              cashRegisterSound.play()

              return {
                ...context.game,
                player: {
                  ...context.game.player,
                  deck: [...context.game.player.deck, event.data.card],
                  gold: context.game.player.gold - event.data.card.price,
                },
              }
            },
          }),
        },
        ITEM_SHOP_ITEM_CLICK: {
          target: 'Shopping',
          actions: assign({
            game: ({ context, event }) => {
              buttonClickSound.play()
              cashRegisterSound.play()

              const item = event.data.item

              item.sfx.obtain.play()

              return {
                ...context.game,
                player: {
                  ...context.game.player,
                  inventory: [
                    ...context.game.player.inventory,
                    // We need to add a unique identifier in the case of duplicate inventory items in player inventory
                    { ...item, id: `${item.id}-${crypto.randomUUID()}` },
                  ],
                  gold: context.game.player.gold - item.cost,
                },
              }
            },
          }),
        },
        NEXT_BATTLE_CLICK: {
          target: 'NewRound',
          actions: () => buttonClickSound.play(),
        },
      },
    },
    DestroyingCard: {
      tags: ['gameplay'],
      entry: assign({
        game: ({ context }) => {
          buttonClickSound.play()
          cashRegisterSound.play()

          const cardToDestroy = context.game.cardToDestroy

          if (!cardToDestroy) return context.game

          const nextDeck = [
            ...context.game.player.deck.filter((card) => card.id !== cardToDestroy.id),
          ]

          return {
            ...context.game,
            player: {
              ...context.game.player,
              deck: nextDeck,
              gold: context.game.player.gold - context.game.cardDestructionPrice,
            },
          }
        },
      }),
      on: {
        CARD_DESTRUCTION_ANIMATION_COMPLETE: {
          target: 'DestroyingCards',
        },
      },
    },
    DestroyingCards: {
      tags: ['gameplay'],
      on: {
        DESTRUCTION_SHOP_CARD_CLICK: {
          target: 'DestroyingCard',
          actions: assign({
            game: ({ context, event }) => {
              console.log('event.data.card', event.data.card)
              return {
                ...context.game,
                cardToDestroy: {
                  ...event.data.card,
                  orientation: 'face-up' as const,
                  status: 'in-play' as const,
                },
              }
            },
          }),
        },
        LEAVE_DESTROYING_CARDS_CLICK: {
          target: 'BetweenRounds',
          actions: () => buttonClickSound.play(),
        },
        NEXT_BATTLE_CLICK: {
          target: 'NewRound',
          actions: () => buttonClickSound.play(),
        },
      },
    },
    Defeat: {
      entry: () => {
        loseSound.play()
      },
      tags: ['gameplay'],
    },
  },
})
