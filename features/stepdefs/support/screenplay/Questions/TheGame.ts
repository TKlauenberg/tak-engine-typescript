import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const TheGame = {
  hasEnded: Question.about('has the game ended', (actor) =>
    PlayTheGame.as(actor).hasEnded(),
  ),
  result: Question.about('the result of the game', (actor) =>
    PlayTheGame.as(actor).gameResult(),
  ),
};
