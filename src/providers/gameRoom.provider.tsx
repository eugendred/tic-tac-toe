import { useState, useCallback, useEffect, useMemo, createContext, PropsWithChildren } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { GameModeEnum } from '../types';
import useFetch from '../hooks/useFetch';

export type GameRoomContextProps = {
  readonly gameMode: GameModeEnum;
  setGameMode: (mode: GameModeEnum) => void;
  startNewGame: () => Promise<void>;
  backToHome: () => void;
};

export const GameRoomContext = createContext<GameRoomContextProps>({} as GameRoomContextProps);

const useGameRoomContextValues = () => {
  const { postData } = useFetch();
  const { roomId } = useParams();
  const [queryParams, setQueryParams] = useSearchParams();
  const [gameMode, setGameMode] = useState(GameModeEnum.SINGLE_PLAYER);
  const navigateTo = useNavigate();

  const startNewGame = useCallback(
    async (): Promise<void> => {
      try {
        const res = await postData('/api/rooms', null);
        if (res) {
          let routePath = '/game-room';
          if (gameMode === GameModeEnum.ONLINE) {
            routePath += `/${res.roomId}`;
          } else {
            routePath += `?mode=${gameMode}`;
          }
          navigateTo(routePath, { replace: true });
        };
      } catch (error) {
        console.error(error);
      }
    },
    [postData, navigateTo],
  );

  const backToHome = useCallback(
    () => {
      setQueryParams((prev) => {
        prev.delete('mode');
        return prev;
      });
      setGameMode(GameModeEnum.SINGLE_PLAYER);
      navigateTo('/');
    },
    [navigateTo],
  );

  useEffect(
    () => {
      let mode = queryParams.get('mode') || GameModeEnum.SINGLE_PLAYER;
      if (roomId) {
        mode = GameModeEnum.ONLINE;
      }
      setGameMode(mode as GameModeEnum);
    },
    [],
  );

  const memoedValues: GameRoomContextProps = useMemo(
    () => ({
      gameMode,
      setGameMode,
      startNewGame,
      backToHome,
    }),
    [
      gameMode,
      setGameMode,
      startNewGame,
      backToHome,
    ],
  );

  return memoedValues;
};

export const GameRoomContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useGameRoomContextValues();

  return <GameRoomContext.Provider value={values}>{children}</GameRoomContext.Provider>;
};
