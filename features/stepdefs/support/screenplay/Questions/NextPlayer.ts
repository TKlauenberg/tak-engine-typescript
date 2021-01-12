import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { Player } from '../../../../../lib';
import { PlayTheGame } from '../Abilities';

export const nextPlayer = Question.about('the next player', (actor) =>
  PlayTheGame.as(actor).nextPlayer(),
);
