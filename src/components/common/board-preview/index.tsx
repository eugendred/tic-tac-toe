import { useMemo } from 'react';
import Box from '@mui/material/Box';

import { CircleIcon, XMarkIcon } from '../board-icons';

import './index.scss';

export const GameBoardPreview: React.FC = () => {
  const boardCells = useMemo(
    () => (
      ['X','','O','','X','','O','','X'].map((value, idx) => (
        <span key={idx} className="board-cell">
          {value === 'O' ? <CircleIcon infinite /> : value === 'X' ? <XMarkIcon infinite /> : ''}
        </span>
      ))
    ),
    [],
  );

  return (
    <Box className="preview-board">
      {boardCells}
    </Box>
  )
};
