import { PlayAreaContext } from './types'

export const playerIsAlive = (ctx: PlayAreaContext) => ctx.player.stats.health > 0

export const playerIsDead = (ctx: PlayAreaContext) => ctx.player.stats.health <= 0

export const monsterIsAlive = (ctx: PlayAreaContext) =>
  ctx.monster ? ctx.monster.stats.health > 0 : false

export const monsterIsDead = (ctx: PlayAreaContext) =>
  ctx.monster ? ctx.monster.stats.health <= 0 : false

export const playerCanDraw = (ctx: PlayAreaContext) => ctx.drawPile.length > 0

export const drawingIsNotNeeded = (ctx: PlayAreaContext) =>
  ctx.drawPile.length === 0 && ctx.currentHand.length > 0

export const playerCannotDraw = (ctx: PlayAreaContext) =>
  ctx.drawPile.length === 0 && ctx.currentHand.length === 0
