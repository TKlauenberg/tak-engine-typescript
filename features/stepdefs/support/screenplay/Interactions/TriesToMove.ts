/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  AnswersQuestions,
  Interaction,
  UsesAbilities,
} from '@serenity-js/core';
import { Direction, Move as MoveAction, MoveType } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const TriesToMove = (amount: number) => {
  return {
    from(position: string) {
      return {
        moving(direction: Direction) {
          return {
            droppingOneStoneOnEachSquare() {
              const drops = new Array<number>(amount).fill(1);
              return new TryMoveStones(amount, position, direction, drops);
            },
            movingTheCompleteStack: () =>
              new TryMoveStones(amount, position, direction, [amount]),
          };
        },
      };
    },
  };
};
/**
 * Interaction for placing stones
 */
export class TryMoveStones extends Interaction {
  #amount: number;
  #position: string;
  #direction: Direction;
  #drops: number[];
  /**
   *
   * @param {number} amount
   * @param {string} position
   * @param {Direction} direction
   * @param {number[]} drops
   */
  constructor(
    amount: number,
    position: string,
    direction: Direction,
    drops: number[],
  ) {
    // TODO: create move string representation
    super('tries to move stones');
    this.#amount = amount;
    this.#position = position;
    this.#direction = direction;
    this.#drops = drops;
  }
  /**
   *
   * @param {UsesAbilities&AnswersQuestions} actor
   * @return {Promise<void>}
   */
  performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
    const move: MoveAction = {
      action: MoveType.Move,
      amount: this.#amount,
      position: this.#position,
      direction: this.#direction,
      drops: this.#drops,
    };
    return PlayTheGame.as(actor).tryExecute(move);
  }
}
