import { useCallback, useEffect, useContext, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  ButtonGroup,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  RadioGroup,
  Radio,
  Tooltip,
  TextField,
  MenuItem,
  styled
} from '@mui/material';
import { ArrowBackIos, RestartAlt, PlayCircleOutline, Undo } from '@mui/icons-material';

import { SinglePlayerContext, ModalContext } from '../../providers';
import useWindowSize from '../../hooks/useWindowSize';
import { GameLevelEnum } from '../../utils';

import { GameBoard, GameResultPopup } from './shared';

const StyledGameLayout = styled(Box)({
  minHeight: '92vh',
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  '@media (max-width: 576px)': {
    '.MuiButton-startIcon': {
      margin: 0,
    },
  },
})

const SinglePlayer: React.FC = () => {
  const { handleModal } = useContext(ModalContext);
  const {
    boardSize,
    boardState,
    gameState,
    gameLevel,
    replaying,
    setBoardSize,
    setGameLevel,
    restartGame,
    replayGame,
    undoMove,
  } = useContext(SinglePlayerContext);
  const navigateTo = useNavigate();
  const { width } = useWindowSize();

  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const handleChangeBoardSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!gameStarted) setBoardSize(Number(e.target.value));
    },
    [gameStarted],
  );

  const handleChangeGameLevel = useCallback(
    (e: any) => {
      if (!gameStarted) setGameLevel(e.target.value);
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
      <Box sx={{ mb: 1.5 }}>
        <ButtonGroup variant="outlined">
          <StyledButton
            startIcon={<ArrowBackIos />}
            onClick={handleGoBack}
          >
            {width > 576 ? 'Back' : ''}
          </StyledButton>
          <StyledButton
            disabled={!gameStarted || replaying}
            startIcon={<PlayCircleOutline />}
            onClick={restartGame}
          >
            {width > 576 ? 'Restart' : ''}
          </StyledButton>
          <StyledButton
            disabled={!gameStarted || replaying}
            startIcon={<Undo />}
            onClick={undoMove}
          >
            {width > 576 ? 'Undo' : ''}
          </StyledButton>
          <StyledButton
            disabled={!gameState.gameOver || replaying}
            startIcon={<RestartAlt />}
            onClick={replayGame}
          >
            {width > 576 ? 'Replay' : ''}
          </StyledButton>
        </ButtonGroup>
      </Box>

      <Box sx={{ mb: 1 }}>
        <FormControl>
          <FormLabel>Game Size:</FormLabel>
          <RadioGroup
            row
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

      <Box sx={{ mb: 1 }}>
        <FormControl>
          <FormLabel>Game Level:</FormLabel>
          <RadioGroup
            row
            value={gameLevel || GameLevelEnum.EASY}
            onChange={handleChangeGameLevel}
          >
            <FormControlLabel control={<Radio />} value={GameLevelEnum.EASY} label="Easy" />
            <FormControlLabel control={<Radio />} value={GameLevelEnum.MEDIUM} label="Medium" />
            <FormControlLabel control={<Radio />} value={GameLevelEnum.HARD} label="Hard" />
          </RadioGroup>
        </FormControl>
      </Box>

      <GameBoard />
    </StyledGameLayout>
  );
};

export default memo(SinglePlayer);
