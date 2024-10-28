export enum GameModeEnum {
  SINGLE_PLAYER = 'single-player',
  MULTIPLAYER = 'multiplayer',
  LIVE = 'live',
};

export enum GameLevelEnum {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
};

export enum GameSizeEnum {
  DEFAULT = 3,
  EXTENDED = 4,
};

export enum GamePlayerEnum {
  X = 'X',
  O = 'O',
};

export type GameStateProps = {
  player: GamePlayerEnum,
  isOver: boolean;
  winner: string;
  replaying: boolean;
  loading: boolean;
};

export type GameEvaluationResult = {
  isOver: boolean;
  winner: string;
};

export type GameSettings = {
  mode: GameModeEnum;
  size: GameSizeEnum;
};
