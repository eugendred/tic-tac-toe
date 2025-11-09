export type GameStatistics = {
  playerXWins: number;
  playerOWins: number;
  draws: number;
};

const STATISTICS_STORAGE_KEY = 'tic-tac-toe-statistics';

const DEFAULT_STATISTICS: GameStatistics = {
  playerXWins: 0,
  playerOWins: 0,
  draws: 0,
};

export const getStatistics = (): GameStatistics => {
  try {
    const stored = localStorage.getItem(STATISTICS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as GameStatistics;
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
  return { ...DEFAULT_STATISTICS };
};

export const saveStatistics = (statistics: GameStatistics): void => {
  try {
    localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(statistics));
  } catch (error) {
    console.error('Error saving statistics:', error);
  }
};

export const updateStatistics = (winner: string): GameStatistics => {
  const currentStats = getStatistics();
  const updatedStats: GameStatistics = { ...currentStats };

  if (winner === 'X') {
    updatedStats.playerXWins += 1;
  } else if (winner === 'O') {
    updatedStats.playerOWins += 1;
  } else if (winner === 'DRAW') {
    updatedStats.draws += 1;
  }

  saveStatistics(updatedStats);
  return updatedStats;
};

export const resetStatistics = (): GameStatistics => {
  const defaultStats = { ...DEFAULT_STATISTICS };
  saveStatistics(defaultStats);
  return defaultStats;
};

