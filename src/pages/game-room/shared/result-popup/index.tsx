import { memo } from 'react';

import Box from '@mui/material/Box';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import Handshake from '@mui/icons-material/Handshake';

const WINNER = {
  O: 'Player O',
  X: 'Player X',
  DRAW: 'DRAW',
} as any;

export type GameResultPopupProps = {
  winner: string;
};

export const GameResultPopup: React.FC<GameResultPopupProps> = memo(({ winner }) => (
  <Box sx={{ textAlign: 'center' }}>
    {winner !== WINNER.DRAW ? (
      <EmojiEvents sx={{ color: 'gold', fontSize: '6rem' }}/>
    ) : (
      <Handshake sx={{ color: 'cornflowerblue', fontSize: '6rem' }}/>
    )}
    
    <Box sx={{ fontSize: '1.25rem' }}>
      {`${WINNER[winner]}`}
    </Box>
  </Box>
));
