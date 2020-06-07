import { Question } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';
import { Board as IBoard } from '../../../../../lib';

const ofTheGame = (): Question<Promise<IBoard>> =>
  Question.about('board of the game', (actor) =>
    PlayTheGame.as(actor).getBoard(),
  );

const isEmpty = (): Question<Promise<boolean>> =>
  Question.about('is the board empty', async (actor) =>
    (await actor.answer(ofTheGame())).every((x) =>
      x.every((y) => y.stones.length === 0),
    ),
  );

export const Board = {
  ofTheGame,
  isEmpty,
};

export const sizeOfTheBoard = (): Question<Promise<number>> =>
  Question.about('the size of the board', (actor) =>
    PlayTheGame.as(actor).getSize(),
  );
