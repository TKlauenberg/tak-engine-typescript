import { Actor, Cast } from '@serenity-js/core';
import { PlayTheGame } from './Abilities';

/**
 * Setup Cast for Serenity
 */
export class Actors implements Cast {
  /**
   *
   * @param {Actor} actor actor to prepare
   * @return {Actor};
   */
  prepare(actor: Actor): Actor {
    return actor.whoCan(new PlayTheGame());
  }
}
