import { useCallback, useContext, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  ButtonGroup,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  styled
} from '@mui/material';
import { ArrowBackIos, RestartAlt, PlayCircleOutline, Undo } from '@mui/icons-material';

import { SinglePlayerContext } from '../../providers';
import { GameBoard } from '../../components';

const StyledGameLayout = styled(Box)({
  height: '96vh',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
});

const WINNER = {
  O: 'PC',
  X: 'Player'
} as any;

const SinglePlayer: React.FC = () => {
  const {
    boardSize,
    boardState,
    gameState,
    setBoardSize,
    restartGame,
    replayGame,
    undoMove,
  } = useContext(SinglePlayerContext);
  const navigateTo = useNavigate();

  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const handleChangeBoardSize = useCallback(
    (e) => {
      if (!gameStarted) setBoardSize(Number(e.target.value));
    },
    [gameStarted],
  );

  const handleGoBack = useCallback(
    () => navigateTo('/'),
    [navigateTo],
  );

  return (
    <StyledGameLayout>
      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant="outlined">
          <Button
            startIcon={<ArrowBackIos />}
            onClick={handleGoBack}
          >
            Back
          </Button>
          <Button
            disabled={!gameStarted}
            endIcon={<PlayCircleOutline />}
            onClick={restartGame}
          >
            Restart
          </Button>
          <Button
            disabled={!gameStarted}
            endIcon={<Undo />}
            onClick={undoMove}
          >
            Undo
          </Button>
          <Button
            disabled={!gameState.gameOver}
            endIcon={<RestartAlt />}
            onClick={replayGame}
          >
            Replay
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl>
          <FormLabel>Game Size:</FormLabel>
          <RadioGroup
            row
            name="board_size"
            value={boardSize || 3}
            onChange={handleChangeBoardSize}
          >
            <FormControlLabel control={<Radio />} value={3} label="3x3" disabled={gameStarted} />
            <FormControlLabel control={<Radio />} value={4} label="4x4" disabled={gameStarted} />
            <FormControlLabel control={<Radio />} value={5} label="5x5" disabled={gameStarted} />
          </RadioGroup>
        </FormControl>
      </Box>

      <GameBoard />

      {gameState.gameOver ? (
        <Alert variant="outlined" severity="info" sx={{ mt: 2 }}>
          <Box>WINNER: {WINNER[gameState.winner] || 'DRAW'}</Box>
        </Alert>
      ) : null}
    </StyledGameLayout>
  );
};

export default memo(SinglePlayer);
