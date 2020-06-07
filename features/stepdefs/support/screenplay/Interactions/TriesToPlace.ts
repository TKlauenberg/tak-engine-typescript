import {
  Interaction,
  UsesAbilities,
  AnswersQuestions,
} from '@serenity-js/core';
import { StoneType, Place as PlaceMove, MoveType } from '../../../../../lib';
import { PlayTheGame } from '../Abilities/PlayTheGame';

/**
 * Interaction for placing stones
 */
export class TriesToPlace extends Interaction {
  /**
   * @param {StoneType} stoneType
   * @return {Place}
   */
  static a(stoneType: StoneType): { on: (position: string) => TriesToPlace } {
    return {
      on: (position: string) => new TriesToPlace(stoneType, position),
    };
  }
  #stoneType: StoneType;
  #position: string;
  /**
   *
   * @param {StoneType} stoneType stonetype of the place action
   * @param {string} position
   */
  constructor(stoneType: StoneType, position: string) {
    super();
    this.#stoneType = stoneType;
    this.#position = position;
  }
  /**
   *
   * @param {UsesAbilities&AnswersQuestions} actor
   * @return {Promise<void>}
   */
  performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
    const move: PlaceMove = {
      action: MoveType.Place,
      position: this.#position,
      stoneType: this.#stoneType,
    };
    return PlayTheGame.as(actor).tryExecute(move);
  }
}
