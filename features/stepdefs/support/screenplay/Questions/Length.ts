import {
  Question,
  Answerable,
  AnswersQuestions,
  UsesAbilities,
} from '@serenity-js/core';

export const Length = {
  of: (obj: Answerable<ObjectWithLength>): Question<Promise<number>> =>
    new LengthOf(obj),
};
interface ObjectWithLength {
  length: number;
}

/**
 * get the length ob an object
 */
class LengthOf implements Question<Promise<number>> {
  /**
   *
   * @param {ObjectWithLength} lengthOf
   */
  constructor(private readonly lengthOf: Answerable<ObjectWithLength>) {}
  /**
   *
   * @param {AnswersQuestions} actor
   * @return {Promise<number>}
   */
  async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<number> {
    const obj = Question.isAQuestion(this.lengthOf)
      ? await actor.answer(this.lengthOf)
      : await this.lengthOf;
    return obj.length;
  }
}
