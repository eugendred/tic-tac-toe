import { useCallback, useEffect, useMemo, memo } from 'react';

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

import { useGameBoard, useModal, useWindowSize } from '../../hooks';
import { GameModeEnum, GameLevelEnum } from '../../types';

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

const GameRoom: React.FC = () => {
  const { handleModal } = useModal();
  const {
    gameMode,
    boardSize,
    boardState,
    gameState,
    gameLevel,
    setBoardSize,
    setGameLevel,
    restartGame,
    replayGame,
    undoMove,
    backToHome,
  } = useGameBoard();
  const { width } = useWindowSize();

  const isSinglePlayerGame = useMemo(() => gameMode === GameModeEnum.SINGLE_PLAYER, [gameMode]);
  const isMultiplayerGame = useMemo(() => gameMode === GameModeEnum.MULTIPLAYER, [gameMode]);
  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const handleChangeBoardSize = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!gameStarted) setBoardSize(Number(e.target.value));
    },
    [gameStarted],
  );

  const handleChangeGameLevel = useCallback(
    (e: any) => {
      if (isSinglePlayerGame && !gameStarted) setGameLevel(e.target.value);
    },
    [gameStarted, isSinglePlayerGame],
  );

  useEffect(() => {
    if (gameState.isOver) {
      handleModal({
        title: 'Game Over',
        body: <GameResultPopup winner={gameState.winner} />
      });
    }
  }, [gameState.isOver, handleModal]);

  return (
    <StyledGameLayout>
      <Box sx={{ mb: 1.5 }}>
        <ButtonGroup variant="outlined">
          <StyledButton
            startIcon={<ArrowBackIos />}
            onClick={backToHome}
          >
            {width > 576 ? 'Back' : ''}
          </StyledButton>

          <StyledButton
            disabled={!gameStarted || gameState.replaying}
            startIcon={<PlayCircleOutline />}
            onClick={restartGame}
          >
            {width > 576 ? 'Restart' : ''}
          </StyledButton>

          {isSinglePlayerGame ? (
            <StyledButton
              disabled={!gameStarted || gameState.replaying}
              startIcon={<Undo />}
              onClick={undoMove}
            >
              {width > 576 ? 'Undo' : ''}
            </StyledButton>
          ) : null}

          <StyledButton
            disabled={!gameState.isOver || gameState.replaying}
            startIcon={<RestartAlt />}
            onClick={replayGame}
          >
            {width > 576 ? 'Replay' : ''}
          </StyledButton>
        </ButtonGroup>
      </Box>

      <Box sx={{ mb: 0.25 }}>
        <FormControl>
          <FormLabel>Game Size:</FormLabel>
          <RadioGroup row value={boardSize || 3} onChange={handleChangeBoardSize}>
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

      {isSinglePlayerGame ? (
        <Box sx={{ mb: 0.25 }}>
          <FormControl>
            <FormLabel>Game Level:</FormLabel>
            <RadioGroup row value={gameLevel || GameLevelEnum.EASY} onChange={handleChangeGameLevel}>
              <FormControlLabel control={<Radio />} value={GameLevelEnum.EASY} label="Easy" />
              <FormControlLabel control={<Radio />} value={GameLevelEnum.MEDIUM} label="Medium" />
              <FormControlLabel control={<Radio />} value={GameLevelEnum.HARD} label="Hard" />
            </RadioGroup>
          </FormControl>
        </Box>
      ) : null}

      {isMultiplayerGame ? (
        <Box sx={{ mb: 1 }}>
          <FormControl>
            <FormLabel>Player {gameState.player} Move</FormLabel>
          </FormControl>
        </Box>
      ) : null}

      <GameBoard />
    </StyledGameLayout>
  );
};

export default memo(GameRoom);
