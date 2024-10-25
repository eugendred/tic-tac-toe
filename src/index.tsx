import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ModalContextProvider, GameRoomContextProvider } from './providers';
import { FallbackView } from './components';
import App from './app.tsx';

import './index.scss';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1400,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<FallbackView />}>
      <ThemeProvider theme={theme}>
        <ModalContextProvider>
          <BrowserRouter>
            <GameRoomContextProvider>
              <App />
            </GameRoomContextProvider>
          </BrowserRouter>
        </ModalContextProvider>
      </ThemeProvider>
    </Suspense>    
  </StrictMode>,
);
