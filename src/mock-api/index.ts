import { createServer } from 'miragejs';

import { findWinner, calcNextMove } from './utils';

export function initServer() {
  return createServer({
    routes() {
      this.namespace = 'api';

      this.post('/rooms', () => {
        return {
          roomId: Math.floor(Math.random() * 100) + 1,
        }
      });

      this.post('/make-move', (_, request) => {
        const { board } = JSON.parse(request.requestBody);
        const gameState = findWinner(board);
        if (gameState.gameOver) {
          return {
            gameState,
            board,
            moveIdx: null,
          };
        }

        const nextBoard = [...board];
        const nextMoveIdx = calcNextMove(board);
        if (nextMoveIdx !== null) nextBoard[nextMoveIdx] = 'O';
        return {
          gameState: findWinner(nextBoard),
          board: nextBoard,
          moveIdx: nextMoveIdx,
        };
      });
    },
  });
}
