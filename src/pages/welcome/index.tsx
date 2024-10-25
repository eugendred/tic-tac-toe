import { useCallback, memo } from 'react';

import {
  Box,
  Button, 
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Tooltip,
  styled,
} from '@mui/material';
import SportsScore from '@mui/icons-material/SportsScore';

import useGameRoom from '../../hooks/useGameRoom';
import { AnimatedTitle, GameBoardPreview } from '../../components';
import { GameModeEnum } from '../../types';

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
  const { gameMode, setGameMode, startNewGame } = useGameRoom();

  const handleChangeGameMode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGameMode(e.target.value as GameModeEnum);
    },
    [],
  );

  return (
    <BaseContainer>
      <Box>
        <AnimatedTitle text="TIC TAC TOE" />
      </Box>

      <GameBoardPreview />

      <Box sx={{ mb: 2 }}>
        <FormControl>
          <RadioGroup
            row
            value={gameMode || GameModeEnum.SINGLE_PLAYER}
            onChange={handleChangeGameMode}
          >
            <FormControlLabel control={<Radio />} value={GameModeEnum.SINGLE_PLAYER} label="Single Player" />
            <FormControlLabel control={<Radio />} value={GameModeEnum.MULTIPLAYER} label="Multiplayer" />
            <Tooltip title="Not available yet">
              <FormControlLabel control={<Radio />} label="Online" disabled />
            </Tooltip>
          </RadioGroup>
        </FormControl>
      </Box>

      <Button
        variant="outlined"
        endIcon={<SportsScore />}
        onClick={startNewGame}
      >
        Start Game
      </Button>
    </BaseContainer>
  );
};

export default memo(WelcomePage);
