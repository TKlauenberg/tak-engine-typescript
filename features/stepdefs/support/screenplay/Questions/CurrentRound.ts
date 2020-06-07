import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const currentRound = (): CurrentRound => new CurrentRound();

/**
 * which round it is currently
 */
class CurrentRound implements Question<Promise<number>> {
  /**
   *
   * @param {UsesAbilities} actor
   * @return {number}
   */
  answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<number> {
    return PlayTheGame.as(actor).currentRound();
  }
  /**
   * @return {string}
   */
  toString(): string {
    return 'the current round';
  }
}
