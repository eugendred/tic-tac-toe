import { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, styled } from '@mui/material';
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline';

import useFetch from '../../hooks/useFetch';
import { AnimatedTitle, GameBoardPreview } from '../../components';

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
  const { postData } = useFetch();
  const navigateTo = useNavigate();

  const handleClickStartGame = useCallback(
    async () => {
      try {
        const res = await postData('/api/rooms', null);
        if (res) navigateTo(`/single-player/${res.roomId}`, { replace: true });
      } catch (error) {
        console.error(error);
      }
    },
    [postData, navigateTo],
  );

  return (
    <BaseContainer>
      <Box sx={{ mb: 2 }}>
        <AnimatedTitle text="TIC TAC TOE" />
      </Box>

      <GameBoardPreview />

      <Button
        variant="outlined"
        endIcon={<PlayCircleOutline />}
        onClick={handleClickStartGame}
      >
        Start Game
      </Button>
    </BaseContainer>
  );
};

export default memo(WelcomePage);
