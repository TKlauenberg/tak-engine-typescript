import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';

export const currentRound = Question.about(
  'the current round',
  (actor: AnswersQuestions & UsesAbilities) =>
    PlayTheGame.as(actor).currentRound(),
);
