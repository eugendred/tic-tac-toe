import { useCallback, useEffect, useContext, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  ButtonGroup,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Tooltip,
  styled
} from '@mui/material';
import { ArrowBackIos, RestartAlt, PlayCircleOutline, Undo } from '@mui/icons-material';

import { SinglePlayerContext, ModalContext } from '../../providers';

import { GameBoard, GameResultPopup } from './shared';

const StyledGameLayout = styled(Box)({
  height: '96vh',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
});

const SinglePlayer: React.FC = () => {
  const { handleModal } = useContext(ModalContext);
  const {
    boardSize,
    boardState,
    gameState,
    replaying,
    setBoardSize,
    restartGame,
    replayGame,
    undoMove,
  } = useContext(SinglePlayerContext);
  const navigateTo = useNavigate();

  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const handleChangeBoardSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!gameStarted) setBoardSize(Number(e.target.value));
    },
    [gameStarted],
  );

  const handleGoBack = useCallback(
    () => navigateTo('/'),
    [navigateTo],
  );

  useEffect(() => {
    if (gameState.gameOver) {
      handleModal({
        title: 'Game Over',
        body: <GameResultPopup winner={gameState.winner} />
      });
    }
  }, [gameState.gameOver, handleModal]);

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
            disabled={!gameStarted || replaying}
            endIcon={<PlayCircleOutline />}
            onClick={restartGame}
          >
            Restart
          </Button>
          <Button
            disabled={!gameStarted || replaying}
            endIcon={<Undo />}
            onClick={undoMove}
          >
            Undo
          </Button>
          <Button
            disabled={!gameState.gameOver || replaying}
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
            <FormControlLabel control={<Radio />} value={3} label="3x3" />
            <Tooltip title="Not available yet">
              <FormControlLabel control={<Radio />} label="4x4" disabled />
            </Tooltip>
            <Tooltip title="Not available yet">
              <FormControlLabel control={<Radio />} label="5x5" disabled />
            </Tooltip>
          </RadioGroup>
        </FormControl>
      </Box>

      <GameBoard />
    </StyledGameLayout>
  );
};

export default memo(SinglePlayer);
