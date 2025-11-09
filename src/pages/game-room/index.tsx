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
import { StatisticsDisplay } from '../../components/common';

import { GameBoard, GameResultPopup } from './shared';

const StyledGameLayout = styled(Box)({
  minHeight: '92vh',
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
});

const StyledButton = styled(Button)({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover:not(:disabled)': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active:not(:disabled)': {
    transform: 'translateY(0px)',
  },
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
    statistics,
    setGameLevel,
    restartGame,
    replayGame,
    undoMove,
    backToHome,
  } = useGameBoard();
  const { width } = useWindowSize();

  const isSinglePlayerGame = useMemo(() => gameSettings.mode === GameModeEnum.SINGLE_PLAYER, [gameSettings.mode]);
  const gameStarted = useMemo(() => boardState.some((el) => el !== ''), [boardState]);

  const disableLevels = useMemo(() => {
    return (gameStarted && !gameState.isOver) || gameState.replaying;
  }, [gameStarted, gameState.isOver, gameState.replaying]);

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
      <Box sx={{ mb: 2, width: '100%', maxWidth: '460px' }}>
        <StatisticsDisplay statistics={statistics} />
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <ButtonGroup variant="outlined" size="medium">
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
        <Box sx={{ mb: 1 }}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 600, mb: 0.5 }}>Game Level:</FormLabel>
            <RadioGroup row value={gameLevel || GameLevelEnum.EASY} onChange={handleChangeGameLevel}>
              <FormControlLabel
                disabled={disableLevels}
                control={<Radio />}
                value={GameLevelEnum.EASY}
                label="Easy"
              />
              <FormControlLabel
                disabled={disableLevels}
                control={<Radio />}
                value={GameLevelEnum.MEDIUM}
                label="Medium"
              />
              <FormControlLabel
                disabled={disableLevels}
                control={<Radio />}
                value={GameLevelEnum.HARD}
                label="Hard"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      ) : null}

      <Box sx={{ mb: 1.5 }}>
        <FormControl>
          <FormLabel sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Player's Turn: <span style={{ color: playerTurn === 'X' ? '#4285F4' : '#DE3E35', fontWeight: 700 }}>{playerTurn}</span>
          </FormLabel>
        </FormControl>
      </Box>

      <GameBoard />
    </StyledGameLayout>
  );
};

export default memo(GameRoom);
