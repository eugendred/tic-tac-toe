import { sleep } from './common';

export type GameState = {
  gameOver: boolean;
  winner: string;
};

export const getEmptyCellsIds = (board: string[]): number[] => {
  return board.reduce((res, el: string, idx: number) => (!el ? [...res, idx] : res), [] as number[]);
};

export const calcWinnerCombinations = (boardSize: number): number[][] => {
  const combinations: number[][] = [];

  // Rows
  for (let row = 0; row < boardSize; row++) {
    const rowCombination: number[] = [];
    for (let col = 0; col < boardSize; col++) {
      rowCombination.push(row * boardSize + col);
    }
    combinations.push(rowCombination);
  }

  // Columns
  for (let col = 0; col < boardSize; col++) {
    const colCombination: number[] = [];
    for (let row = 0; row < boardSize; row++) {
      colCombination.push(row * boardSize + col);
    }
    combinations.push(colCombination);
  }

  // Diagonals
  const diagonal1: number[] = [];
  const diagonal2: number[] = [];
  for (let i = 0; i < boardSize; i++) {
    diagonal1.push(i * boardSize + i);
    diagonal2.push(i * boardSize + (boardSize - 1 - i));
  }
  combinations.push(diagonal1);
  combinations.push(diagonal2);

  return combinations;
};

export const evaluateGame = (board: string[]): GameState => {
  const boardSize = Math.sqrt(board.length);
  const combinations = calcWinnerCombinations(boardSize);
  let winner: string = '';

  for (const combination of combinations) {
    const hasWinner = combination.every((idx) => board[idx] === board[combination[0]]);
    if (hasWinner && board[combination[0]] !== '') {
      winner = board[combination[0]];
      break;
    }
  }

  const isDraw = board.every((value) => Boolean(value)) && winner === '';
  if (isDraw) {
    winner = 'DRAW';
  }

  return {
    gameOver: Boolean(winner),
    winner,
  };
};

export const minimax = ( board: string[], depth: number, isMaximizing: boolean): number => {
  const { gameOver, winner } = evaluateGame(board);
  if (gameOver) {
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    const emptyCells = getEmptyCellsIds(board);
    for (const index of emptyCells) {
      board[index] = 'O';
      const score = minimax(board, depth + 1, false);
      board[index] = '';
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const emptyCells = getEmptyCellsIds(board);
    for (const index of emptyCells) {
      board[index] = 'X';
      const score = minimax(board, depth + 1, true);
      board[index] = '';
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
};

export const calcNextMove = (board: string[], aiPrecision: number): number | null => {
  let bestScore = -Infinity;
  let bestMove: number | null = null;
  const emptyCells = getEmptyCellsIds(board);

  for (const index of emptyCells) {
    board[index] = 'O';
    const score = minimax(board, 0, false);
    board[index] = '';

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  const randomValue = Math.random() * 100;
  if (randomValue < aiPrecision && emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return bestMove;
};

export const fakeController = async (endpoint: string, reqData: any): Promise<any> => {
  switch (endpoint) {
    case '/api/rooms':
      return {
        data: {
          roomId: Math.floor(Math.random() * 100) + 1,
        }
      }

    case '/api/make-move': {
      await sleep(1000);
      const gameState = evaluateGame(reqData.board);
      if (gameState.gameOver) {
        return {
          data: {
            gameState,
            board: reqData.board,
            moveIdx: null,
          }
        };
      }

      const nextBoard = [...reqData.board];
      const nextMoveIdx = calcNextMove(nextBoard, 0.8);
      if (nextMoveIdx !== null) {
        nextBoard[nextMoveIdx] = 'O';
      }

      return {
        data: {
          gameState: evaluateGame(nextBoard),
          board: nextBoard,
          moveIdx: nextMoveIdx,
        }
      }
    }

    default:
      return {
        status: 404,
        data: null,
      }
  }
};
