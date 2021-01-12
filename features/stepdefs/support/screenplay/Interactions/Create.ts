import { Interaction, UsesAbilities } from '@serenity-js/core';
import { PlayTheGame } from '../Abilities';
import { GameOptions } from '../../../../../lib';

const withOptions = (options: GameOptions): Interaction =>
  Interaction.where('#actor initializes a Game with Gameoptions', (actor) =>
    PlayTheGame.as(actor).fromOptions(options),
  );
const withPtn = (ptn: string): Interaction =>
  Interaction.where('#actor initializes a Game from a ptn string', (actor) =>
    PlayTheGame.as(actor).fromPtn(ptn),
  );

export const CreateGame = {
  withOptions,
  withPtn,
};
