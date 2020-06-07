import { AnswersQuestions, Question, Answerable } from '@serenity-js/core';
import { Player as PlayerFromLib, Stone, PlayerInfo } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const Player = {
  of: (stone: Answerable<Stone>): Question<Promise<PlayerFromLib>> =>
    new PlayerOfStone(stone),
  number: (number: PlayerFromLib): Question<Promise<PlayerInfo>> =>
    Question.about(`player ${number}`, (actor) =>
      PlayTheGame.as(actor).getPlayerInfo(number),
    ),
};

/**
 * @class PlayerOfStone
 */
class PlayerOfStone implements Question<Promise<PlayerFromLib>> {
  /**
   *
   * @param {Stone} stone stone from which to get the Player
   */
  constructor(private readonly stone: Answerable<Stone>) {}

  /**
   *
   * @param {AnsersQuestions} actor
   */
  async answeredBy(actor: AnswersQuestions): Promise<PlayerFromLib> {
    const stone = Question.isAQuestion(this.stone)
      ? await actor.answer(this.stone)
      : await this.stone;
    return stone.player;
  }
  /**
   * @return {string}
   */
  toString(): string {
    return 'the player of the stone';
  }
}
