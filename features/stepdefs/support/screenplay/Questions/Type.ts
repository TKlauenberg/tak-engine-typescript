import { AnswersQuestions, Question, Answerable } from '@serenity-js/core';
import { Stone, StoneType } from '../../../../../lib';
import { formatted } from '@serenity-js/core/lib/io';

export const Type = {
  of: (stone: Answerable<Stone>): Question<Promise<StoneType>> =>
    new TypeOfStone(stone),
};

/**
 * @class TypeOfStone
 */
class TypeOfStone implements Question<Promise<StoneType>> {
  /**
   *
   * @param {Answerable<Stone>} stone stone from which to get the type
   */
  constructor(private readonly stone: Answerable<Stone>) {}

  /**
   *
   * @param {AnsersQuestions} actor
   */
  async answeredBy(actor: AnswersQuestions): Promise<StoneType> {
    const stone = Question.isAQuestion(this.stone)
      ? await actor.answer(this.stone)
      : await this.stone;
    return stone.type;
  }
  /**
   * @return {string}
   */
  toString(): string {
    return formatted`the type of the stone`;
  }
}
