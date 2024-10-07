import { useCallback, useContext, memo } from 'react';

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

import { SinglePlayerContext } from '../../providers'
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
  const { gameMode, setGameMode, startNewGame } = useContext(SinglePlayerContext);

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
          <RadioGroup row value={gameMode || GameModeEnum.SINGLE_GAME} onChange={handleChangeGameMode}>
            <FormControlLabel control={<Radio />} value={GameModeEnum.SINGLE_GAME} label="Single Game" />
            <Tooltip title="Not available yet">
              <FormControlLabel control={<Radio />} label="Multiplayer" disabled />
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
