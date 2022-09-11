/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Ensure, equals, isFalse, isTrue } from '@serenity-js/assertions';
import { Task } from '@serenity-js/core';
import { Player as IPlayer, Stone, StoneType } from '../../../../../lib';
import {
  AmountOf,
  Board,
  currentRound,
  LastError,
  Length,
  nextPlayer,
  Parsing,
  Player,
  sizeOfTheBoard,
  Stack,
  TheGame,
  TopStone,
  Tps,
  Type,
} from '../Questions';

const checkPlayerNormalStones = (player: IPlayer, amount: number) =>
  Task.where(
    `#actor ckecks if player ${player} has ${amount} normal stones`,
    Ensure.that(AmountOf.normalStonesFromPlayer(player), equals(amount)),
  );
const checkPlayerCapstones = (player: IPlayer, amount: number) =>
  Task.where(
    `#actor checks if player ${player} has ${amount} capstones`,
    Ensure.that(AmountOf.capstonesFromPlayer(player), equals(amount)),
  );
const checkPlayerStones = (
  player: IPlayer,
  normalStones: number,
  capstones: number,
) =>
  Task.where(
    `#actor checks if player ${player} has ${normalStones} normal stones and ${capstones} capstones`,
    checkPlayerNormalStones(player, normalStones),
    checkPlayerCapstones(player, capstones),
  );

export const CheckThat = {
  thePlayer: (player: IPlayer) => {
    return {
      has: (amount: number) => {
        return {
          stones: checkPlayerNormalStones(player, amount),
          capstones: checkPlayerCapstones(player, amount),
          stonesAnd: (capstonesAmount: number) => {
            return {
              capstones: checkPlayerStones(player, amount, capstonesAmount),
            };
          },
        };
      },
    };
  },
  onPos: (pos: string) => {
    return {
      theStack: {
        equals: (stack: Stone[]) =>
          Task.where(
            `#actor checks stack on ${pos}`,
            Ensure.that(Stack.on(pos), equals(stack)),
          ),
        hasOnlyTheStone: (stone: Stone) =>
          Task.where(
            `#actor checks that on ${pos} there is only a ${stone.toString()}`,
            Ensure.that(Length.of(Stack.on(pos)), equals(1)),
            Ensure.that(TopStone.on(pos), equals(stone)),
          ),
      },
      theTopStone: {
        equals: (stone: Stone) =>
          Task.where(
            `#actor checks the top stone on ${pos} is ${stone.toString()}`,
            Ensure.that(TopStone.on(pos), equals(stone)),
          ),
        isFromPlayer: (player: IPlayer) =>
          Task.where(
            `#actor checks if top stone on ${pos} is from Player ${player}`,
            Ensure.that(Player.of(TopStone.on(pos)), equals(player)),
          ),
        isOfType: (type: StoneType) =>
          Task.where(
            `#actor checks if top stone on ${pos} is of type ${type}`,
            Ensure.that(Type.of(TopStone.on(pos)), equals(type)),
          ),
      },
    };
  },
  theNextPlayerIs: (player: IPlayer) =>
    Task.where(
      `#actor checks that the next player is Player ${player}`,
      Ensure.that(nextPlayer, equals(player)),
    ),
  theCurrentRoundIs: (round: number) =>
    Task.where(
      `#actor checks that the current round is ${round}`,
      Ensure.that(currentRound, equals(round)),
    ),
  theSizeOfTheBoardIs: (size: number) =>
    Task.where(
      `#actor checks that the size of the board is ${size}`,
      Ensure.that(sizeOfTheBoard(), equals(size)),
    ),
  theBoardIsEmpty: () =>
    Task.where(
      '#actor checks that the board is empty',
      Ensure.that(Board.isEmpty(), isTrue()),
    ),
  theLastError: {
    exists: () =>
      Task.where(
        '#actor checks if an error exists',
        Ensure.that(LastError.exists(), isTrue()),
      ),
    hasTheMessage: (message: string) =>
      Task.where(
        `#actor checks if the last error Message is "${message}"`,
        Ensure.that(LastError.message(), equals(message)),
      ),
  },
  theGame: {
    hasEnded: () =>
      Task.where(
        '#actor checks if the game has ended',
        Ensure.that(TheGame.hasEnded, isTrue()),
      ),
    hasTheResult: (result: string) =>
      Task.where(
        `#actor checks if the result of the game is ${result}`,
        Ensure.that(TheGame.result, equals(result)),
      ),
  },
  theParsing: {
    wasUnsuccessfull: () =>
      Task.where(
        '#actor checks if the parsing was unsuccessfull',
        Ensure.that(Parsing.result(), isFalse()),
      ),
    wasSuccessfull: () =>
      Task.where(
        '#actor checks if the parsing was successfull',
        Ensure.that(Parsing.result(), isTrue()),
      ),
  },
  theTpsOfTheGameIs: (tps: string) =>
    Task.where(
      `#actor checks if the tps string of the game is ${tps}`,
      Ensure.that(Tps.ofTheGame(), equals(tps)),
    ),
};
