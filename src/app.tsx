import { Suspense, memo, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { GameBoardContextProvider } from './providers';
import { BaseLayout, FallbackView } from './components';

const NotFound = lazy(() => import('./pages/not-found'));
const Welcome = lazy(() => import('./pages/welcome'));
const GameRoom = lazy(() => import('./pages/game-room'));

const App: React.FC = () => (
  <Routes>
    <Route element={<BaseLayout/>}>
      <Route index path="/" element={
        <Suspense fallback={<FallbackView />}>
          <Welcome />
        </Suspense>
      } />

      <Route path="/game-room" element={
        <Suspense fallback={<FallbackView />}>
          <GameBoardContextProvider>
            <GameRoom />
          </GameBoardContextProvider>
        </Suspense>
      } />

      <Route path="/not-found" element={
        <Suspense fallback={<FallbackView />}>
          <NotFound />
        </Suspense>
      } />
    </Route>

    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Routes>
);

export default memo(App);
