import { useCallback, memo, useState, useEffect } from 'react';

import {
  Box,
  Button, 
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Tooltip,
  styled,
} from '@mui/material';
import SportsScore from '@mui/icons-material/SportsScore';

import useGameRoom from '../../hooks/useGameRoom';
import { GameBoardPreview } from '../../components';
import { GameModeEnum, GameSettings, GameSizeEnum } from '../../types';

const BaseContainer = styled(Box)({
  minHeight: '92vh',
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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

const FadeInBox = styled(Box)({
  animation: 'fadeInUp 0.8s ease-out forwards',
  opacity: 0,
});

const WelcomePage: React.FC = () => {
  const { gameSettings, setGameSettings, startNewGame } = useGameRoom();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeGameSettings = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGameSettings((prev: GameSettings) => {
        const { name, value } = e.target;
        const next = { ...prev, [name]: value };
        if (value === GameModeEnum.SINGLE_PLAYER) {
          next.size = GameSizeEnum.DEFAULT;
        }
        return next;
      });
    },
    [setGameSettings],
  );

  return (
    <BaseContainer>
      <GameBoardPreview />

      <FadeInBox sx={{ mb: 1, animationDelay: showContent ? '0s' : '0.3s' }}>
        <FormControl>
          <FormLabel>Mode:</FormLabel>
          <RadioGroup
            row
            sx={{ justifyContent: "center" }}
            name="mode"
            value={gameSettings.mode || GameModeEnum.SINGLE_PLAYER}
            onChange={handleChangeGameSettings}
          >
            <FormControlLabel control={<Radio />} value={GameModeEnum.SINGLE_PLAYER} label="Single Game" />
            <FormControlLabel control={<Radio />} value={GameModeEnum.MULTIPLAYER} label="Multiplayer" />
            <Tooltip title="Not available yet">
              <FormControlLabel control={<Radio />} label="Live" disabled />
            </Tooltip>
          </RadioGroup>
        </FormControl>
      </FadeInBox>

      <FadeInBox sx={{ mb: 1, animationDelay: showContent ? '0.1s' : '0.4s' }}>
        <FormControl>
          <FormLabel>Board Size:</FormLabel>
          <RadioGroup
            row
            sx={{ justifyContent: "center" }}
            name="size"
            value={gameSettings.size || GameSizeEnum.DEFAULT}
            onChange={handleChangeGameSettings}
          >
            <FormControlLabel
              label="3x3"
              control={<Radio />}
              value={GameSizeEnum.DEFAULT}
            />
            <Tooltip title="Not available yet">
              <FormControlLabel
                disabled
                label="4x4"
                control={<Radio />}
                value={GameSizeEnum.EXTENDED}
              />
            </Tooltip>
          </RadioGroup>
        </FormControl>
      </FadeInBox>

      <FadeInBox sx={{ animationDelay: showContent ? '0.2s' : '0.5s' }}>
        <Button
          variant="outlined"
          startIcon={<SportsScore />}
          endIcon={<SportsScore />}
          onClick={startNewGame}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            },
          }}
        >
          Start Game
        </Button>
      </FadeInBox>
    </BaseContainer>
  );
};

export default memo(WelcomePage);
