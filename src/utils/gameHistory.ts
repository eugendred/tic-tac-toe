export interface IGameHistoryAction {
  player: string;
  position: number;
  timestamp: number;
}

export class GameHistoryAction implements IGameHistoryAction {
  constructor(
    public readonly player: string,
    public readonly position: number,
    public readonly timestamp: number = Date.now(),
  ) {
    this.player = player;
    this.position = position;
    this.timestamp = timestamp;
  }
}
