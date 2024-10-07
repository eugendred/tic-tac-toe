export enum GameModeEnum {
  SINGLE_GAME = 'SINGLE_GAME',
  MULTIPLAYER = 'MULTIPLAYER',
};

export enum GameLevelEnum {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
};

export type GameStateProps = {
  isOver: boolean;
  winner: string;
  replaying: boolean;
  loading: boolean;
};

export type GameEvaluationResult = {
  isOver: boolean;
  winner: string;
};
