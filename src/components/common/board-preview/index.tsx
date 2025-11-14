import { useMemo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import { CircleIcon, XMarkIcon } from '../board-icons';

import './index.scss';

const generateExplosionProps = (index: number) => {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const angle = angles[index % angles.length] + (Math.random() * 30 - 15);
  const distance = 400 + Math.random() * 200;
  const rotation = Math.random() * 720 - 360;
  const delay = index * 0.1 + Math.random() * 0.2;
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * distance;
  const y = Math.sin(radians) * distance;
  
  return {
    x,
    y,
    rotation,
    delay,
  };
};

export const GameBoardPreview: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const explosionProps = useMemo(() => {
    const board = ['X','','O','','X','','O','','X'];
    return board.map((_, idx) => generateExplosionProps(idx));
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const boardCells = useMemo(
    () => {
      const board = ['X','','O','','X','','O','','X'];
      return board.map((value, idx) => {
        if (!value) {
          return (
            <span key={idx} className="board-cell">
              {''}
            </span>
          );
        }
        
        const props = explosionProps[idx];
        const IconComponent = value === 'O' ? CircleIcon : XMarkIcon;
        
        return (
          <span 
            key={idx} 
            className={`board-cell ${isAnimating ? 'exploding' : ''}`}
            style={
              isAnimating
                ? {
                    '--explode-x': `${props.x}px`,
                    '--explode-y': `${props.y}px`,
                    '--explode-rotation': `${props.rotation}deg`,
                    '--explode-delay': `${props.delay}s`,
                  } as React.CSSProperties
                : {}
            }
          >
            <IconComponent infinite={!isAnimating} />
          </span>
        );
      });
    },
    [isAnimating, explosionProps],
  );

  return (
    <Box className="preview-board">
      {boardCells}
    </Box>
  )
};
