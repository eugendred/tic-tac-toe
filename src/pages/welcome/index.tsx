import { useCallback, memo } from 'react';

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
});

const WelcomePage: React.FC = () => {
  const { gameSettings, setGameSettings, startNewGame } = useGameRoom();

  const handleChangeGameSettings = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGameSettings((prev: GameSettings) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setGameSettings],
  );

  return (
    <BaseContainer>
      <GameBoardPreview />

      <Box sx={{ mb: 1 }}>
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
      </Box>

      <Box sx={{ mb: 1 }}>
        <FormControl>
          <FormLabel>Board Size:</FormLabel>
          <RadioGroup
            row
            sx={{ justifyContent: "center" }}
            name="size"
            value={gameSettings.size || GameSizeEnum.DEFAULT}
            onChange={handleChangeGameSettings}
          >
            <FormControlLabel control={<Radio />} value={GameSizeEnum.DEFAULT} label="3x3" />
            <FormControlLabel control={<Radio />} value={GameSizeEnum.EXTENDED} label="4x4" disabled />
          </RadioGroup>
        </FormControl>
      </Box>

      <Button
        variant="outlined"
        startIcon={<SportsScore />}
        endIcon={<SportsScore />}
        onClick={startNewGame}
      >
        Start Game
      </Button>
    </BaseContainer>
  );
};

export default memo(WelcomePage);
