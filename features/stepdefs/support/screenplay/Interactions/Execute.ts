/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  AnswersQuestions,
  Interaction,
  UsesAbilities,
} from '@serenity-js/core';
import { PlayTheGame } from '..';
import { Move, parse, Place } from '../../../../../lib/Move';

export const Execute = {
  theMoves: (...moves: string[]) => new ExecuteMoves(moves),
};

/**
 * Interaction for placing stones
 */
export class ExecuteMoves extends Interaction {
  #moves: string[];
  /**
   *
   * @param {string[]} moves
   */
  constructor(moves: string[]) {
    // TODO: create string representation from moves
    super('execute moves');
    this.#moves = moves;
  }
  /**
   *
   * @param {UsesAbilities&AnswersQuestions} actor
   * @return {Promise<void>}
   */
  async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
    for (const moveString of this.#moves) {
      const [parseSuccessfull, move] = parse(moveString[0]);
      if (!parseSuccessfull) {
        throw new Error('Error in feature file! move could not be parsed');
      } else {
        await PlayTheGame.as(actor).execute(move as Move | Place);
      }
    }
  }
}
