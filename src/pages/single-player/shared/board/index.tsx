import { useCallback, useMemo, useContext, memo } from 'react';
import { Box, styled } from '@mui/material';

import { SinglePlayerContext } from '../../../../providers';
import { CircleIcon, XMarkIcon, Spinner } from '../../../../components/common';

const StyledBoardContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',

  '&:after': {
    borderRadius: '0.25rem',
    backgroundColor: '#e2e1e166',
    content: '""',
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },

  '.spin': {
    position: 'absolute',
  },
});

const StyledPlayArea = styled(Box)({
  borderRadius: '0.25rem',
  border: '1px solid #e2e1e1',
  padding: '0.75rem',
  display: 'grid',

  '.board-cell': {
    cursor: 'pointer',
    backgroundColor: '#e2e1e1',
    borderRadius: '0.5rem',
    border: 'none',
    margin: '0.5rem',
    padding: '2.15rem',
    height: '8rem',
    width: '8rem',
    position: 'relative',
    transition: 'opacity 0.3s ease-in',

    '&:hover': {
      opacity: 0.45,
    },

    '&.disabled, &:disabled': {
      cursor: 'not-allowed',
      transition: 'none',
      boxShadow: 'inset 2px 2px 5px 0px rgba(0,0,0,0.5)',
    },

    '&.disabled:hover': {
      opacity: 1,
    },
  },
});

export const GameBoard: React.FC = memo(() => {
  const { loading, boardSize, boardState, gameState, makeMove, addToHistory } = useContext(SinglePlayerContext);

  const handleClickCell = useCallback(
    (idx: number) => () => {
      if (boardState[idx] || gameState.winner || gameState.gameOver) return;
      const nextBoard: string[] = [...boardState];
      nextBoard[idx] = 'X';
      addToHistory('X', idx);
      makeMove(nextBoard, idx);
    },
    [boardState, gameState, makeMove, addToHistory],
  );

  const boardCells = useMemo(
    () => (
      boardState.map((value: string | null, idx: number) => (
        <button
          key={idx}
          disabled={value !== '' || gameState.gameOver}
          className={`board-cell ${value ? 'disabled' : ''}`}
          onClick={handleClickCell(idx)}
        >
          {value === 'O' ? <CircleIcon infinite={!gameState.gameOver} /> : null}
          {value === 'X' ? <XMarkIcon infinite={!gameState.gameOver} /> : null}
        </button>
      ))
    ),
    [boardState, gameState.gameOver, handleClickCell],
  );

  return (
    <StyledBoardContainer
      sx={{
        '&:after': {
          display: loading ? 'block' : 'none',
        }
      }}
    >
      {loading ? <Spinner /> : null}

      <StyledPlayArea
        sx={{
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {boardCells}
      </StyledPlayArea>
    </StyledBoardContainer>
  );
});
