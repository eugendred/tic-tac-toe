import { Suspense, memo, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { SinglePlayerContextProvider } from './providers';
import { BaseLayout, FallbackView } from './components';

const NotFound = lazy(() => import('./pages/not-found'));
const Welcome = lazy(() => import('./pages/welcome'));
const SinglePlayer = lazy(() => import('./pages/single-player'));

const App: React.FC = () => (
  <Routes>
    <Route element={<BaseLayout/>}>
      <Route index path="/" element={
        <Suspense fallback={<FallbackView />}>
          <Welcome />
        </Suspense>
      } />

      <Route path="/single-player/:roomId" element={
          <Suspense fallback={<FallbackView />}>
            <SinglePlayerContextProvider>
              <SinglePlayer />
            </SinglePlayerContextProvider>
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
