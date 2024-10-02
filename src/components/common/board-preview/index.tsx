import { useMemo } from 'react';
import { Box, styled } from '@mui/material';

import { CircleIcon, XMarkIcon } from '../board-icons';

const BoardPreviewContainer = styled(Box)({
  padding: '0.5rem',
  marginBottom: '0.75rem',
  display: 'grid',
  gridTemplateRows: 'repeat(3, 1fr)',
  gridTemplateColumns: 'repeat(3, 1fr)',
  
  '.board-cell': {
    backgroundColor: '#e2e1e1',
    borderRadius: '0.25rem',
    margin: '0.25rem',
    padding: '1.5rem',
    height: '2.75rem',
    width: '2.75rem',
  },
});

export const GameBoardPreview: React.FC = () => {
  const boardCells = useMemo(
    () => (
      ['O','','X','','O','','X','','O'].map((value, idx) => (
        <span key={idx} className="board-cell">
          {value === 'O' ? <CircleIcon /> : value === 'X' ? <XMarkIcon /> : ''}
        </span>
      ))
    ),
    [],
  );

  return (
    <BoardPreviewContainer>
      {boardCells}
    </BoardPreviewContainer>
  )
  // return (
  //   <div className="game-board-preview">
  //     <div>
  //       <div className="h-line" />
  //       <div className="h-line" />
  //     </div>
  //     <div>
  //       <div className="v-line" />
  //       <div className="v-line" />
  //     </div>
  //   </div>
  // )
};
