import { memo } from 'react';
import { Box, Card, CardContent, Typography, styled } from '@mui/material';
import { EmojiEvents, Handshake } from '@mui/icons-material';
import { GameStatistics } from '../../../utils';

import './index.scss';

const StyledCard = styled(Card)(() => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StatItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
  },
});

const StatValue = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '0.5rem',
  transition: 'transform 0.3s ease',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

export type StatisticsDisplayProps = {
  statistics: GameStatistics;
};

export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = memo(({ statistics }) => {
  return (
    <StyledCard className="statistics-display">
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0, sm: 1 },
            alignItems: 'stretch',
          }}
        >
          <StatItem className="stat-item stat-x">
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmojiEvents sx={{ color: '#4285F4', fontSize: '1.5rem' }} />
              <StatLabel>Player X</StatLabel>
            </Box>
            <StatValue className="stat-value">{statistics.playerXWins}</StatValue>
          </StatItem>

          <StatItem className="stat-item stat-o">
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmojiEvents sx={{ color: '#DE3E35', fontSize: '1.5rem' }} />
              <StatLabel>Player O</StatLabel>
            </Box>
            <StatValue className="stat-value">{statistics.playerOWins}</StatValue>
          </StatItem>

          <StatItem className="stat-item stat-draw">
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Handshake sx={{ color: '#F7C223', fontSize: '1.5rem' }} />
              <StatLabel>Draws</StatLabel>
            </Box>
            <StatValue className="stat-value">{statistics.draws}</StatValue>
          </StatItem>
        </Box>
      </CardContent>
    </StyledCard>
  );
});

