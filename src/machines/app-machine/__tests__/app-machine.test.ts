import { createActor, fromPromise, waitFor } from 'xstate'
import { describe, expect, it } from 'vitest'
import { appMachine } from '../app-machine'

describe('appMachine', () => {
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
