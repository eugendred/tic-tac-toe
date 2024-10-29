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
    gameSettings,
    boardState,
    gameState,
    gameLevel,
    playerTurn,
    setGameLevel,
    restartGame,
    replayGame,
    undoMove,
    backToHome,
  } = useGameBoard();
  const { width } = useWindowSize();

  const isSinglePlayerGame = useMemo(() => gameSettings.mode === GameModeEnum.SINGLE_PLAYER, [gameSettings.mode]);
  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const handleChangeGameLevel = useCallback(
    (e: any) => {
      if (isSinglePlayerGame && !gameStarted) setGameLevel(e.target.value);
    },
    [gameStarted, isSinglePlayerGame, setGameLevel],
  );

  useEffect(() => {
    if (gameState.isOver) {
      handleModal({
        title: 'Game Over',
        body: <GameResultPopup winner={gameState.winner} />
      });
    }
  }, [gameState.isOver, gameState.winner, handleModal]);

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

      {isSinglePlayerGame ? (
        <Box sx={{ mb: 0.5 }}>
          <FormControl>
            <FormLabel>Game Level:</FormLabel>
            <RadioGroup row value={gameLevel || GameLevelEnum.EASY} onChange={handleChangeGameLevel}>
              <FormControlLabel
                disabled={gameStarted && !gameState.isOver}
                control={<Radio />}
                value={GameLevelEnum.EASY}
                label="Easy"
              />
              <FormControlLabel
                disabled={gameStarted && !gameState.isOver}
                control={<Radio />}
                value={GameLevelEnum.MEDIUM}
                label="Medium"
              />
              <FormControlLabel
                disabled={gameStarted && !gameState.isOver}
                control={<Radio />}
                value={GameLevelEnum.HARD}
                label="Hard"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      ) : null}

      <Box sx={{ mb: 1 }}>
        <FormControl>
          <FormLabel>Player's Turn: {playerTurn}</FormLabel>
        </FormControl>
      </Box>

      <GameBoard />
    </StyledGameLayout>
  );
};

export default memo(GameRoom);
