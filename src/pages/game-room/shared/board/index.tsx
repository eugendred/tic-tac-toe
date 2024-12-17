import { useCallback, useMemo, memo } from 'react';
import Box from '@mui/material/Box';

import { useGameBoard } from '../../../../hooks';
import { CircleIcon, XMarkIcon, Spinner } from '../../../../components/common';

import './index.scss';

export const GameBoard: React.FC = memo(() => {
  const { gameSettings, boardState, gameState, makeMove } = useGameBoard();

  const handleClickCell = useCallback(
    (idx: number) => () => {
      if (boardState[idx] || gameState.winner || gameState.isOver) return;
      makeMove(idx);
    },
    [boardState, gameState, makeMove],
  );

  const boardCells = useMemo(
    () => (
      boardState.map((value: string | null, idx: number) => (
        <button
          key={idx}
          disabled={value !== '' || gameState.isOver}
          className={`board-cell ${value ? 'disabled' : ''}`}
          onClick={handleClickCell(idx)}
        >
          {value === 'O' ? <CircleIcon infinite={!gameState.isOver} /> : null}
          {value === 'X' ? <XMarkIcon infinite={!gameState.isOver} /> : null}
        </button>
      ))
    ),
    [boardState, gameState.isOver, handleClickCell],
  );

  return (
    <Box
      className="board-container"
      sx={{
        '&:after': {
          display: gameState.loading ? 'block' : 'none',
        }
      }}
    >
      {gameState.loading ? <Spinner /> : null}

      <Box
        className="board-play-area"
        sx={{
          gridTemplateRows: `repeat(${gameSettings.size}, 1fr)`,
          gridTemplateColumns: `repeat(${gameSettings.size}, 1fr)`,
        }}
      >
        {boardCells}
      </Box>
    </Box>
  );
});
