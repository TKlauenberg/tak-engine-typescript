export * from './Board';
export * from './Game';
export * from './Move';
export * from './Player';
export { parse as parsePTN } from './ptn';
export * from './Square';
export * from './Stone';
export * from './Tag';
export type GameResult =
  | 'R-0'
  | '0-R'
  | 'F-0'
  | '0-F'
  | '1-0'
  | '0-1'
  | '1/2-1/2';
