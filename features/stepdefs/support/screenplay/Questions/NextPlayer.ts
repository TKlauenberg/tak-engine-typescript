import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { Player } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const nextPlayer = (): NextPlayerImpl => new NextPlayerImpl();

/**
 * which players turn it is
 */
class NextPlayerImpl implements Question<Promise<Player>> {
  /**
   *
   * @param {UsesAbilities} actor
   * @return {Player}
   */
  answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<Player> {
    return PlayTheGame.as(actor).nextPlayer();
  }
  /**
   * @return {string}
   */
  toString(): string {
    return 'the next player';
  }
}
