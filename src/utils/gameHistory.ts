class GameHistoryAction {
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

export default GameHistoryAction;
