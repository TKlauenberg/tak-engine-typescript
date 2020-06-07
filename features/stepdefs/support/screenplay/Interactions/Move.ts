/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  AnswersQuestions,
  Interaction,
  UsesAbilities,
} from '@serenity-js/core';
import { Direction, Move as MoveAction, MoveType } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const Move = (amount: number) => {
  return {
    from(position: string) {
      return {
        moving(direction: Direction) {
          return {
            droppingOneStoneOnEachSquare() {
              const drops = new Array(amount).fill(1);
              return new MoveStones(amount, position, direction, drops);
            },
            movingTheCompleteStack: () =>
              new MoveStones(amount, position, direction, [amount]),
          };
        },
      };
    },
  };
};
/**
 * Interaction for placing stones
 */
export class MoveStones extends Interaction {
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
    super();
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
    return PlayTheGame.as(actor).execute(move);
  }
}
