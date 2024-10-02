export const calcNextMove = (board: Array<string | null>) => {
  for (let i = 0; i < 3; i++) {
    if (board[i * 3] === board[i * 3 + 1] && board[i * 3] !== '') {
      if (board[i * 3 + 2] === '') return i * 3 + 2;
    }

    if (board[i] === board[i + 3] && board[i] !== '') {
      if (board[i + 6] === '') return i + 6;
    }
  }

  if (board[0] === board[4] && board[0] !== '') {
    if (board[8] === '') return 8;
  }

  if (board[2] === board[4] && board[2] !== '') {
    if (board[6] === '') return 6;
  }

  const emptyCells = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      emptyCells.push(i);
    }
  }
  if (emptyCells.length > 0) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return null;
};

export type BoardWinner = {
  gameOver: boolean;
  isDraw: boolean;
  winner: string;
};

export const findWinner = (board: Array<string | null>): BoardWinner => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winner: string = '';

  for (let i = 0, len = lines.length; i < len; i++) {
    const [a, b, c] = lines[i];
    if (!board[a] || !board[b] || !board[c]) continue;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
    }
  }
  const isDraw = board.every((value) => Boolean(value)) && winner === '';
  
  return {
    gameOver: winner !== '' || isDraw,
    isDraw,
    winner,
  };
};