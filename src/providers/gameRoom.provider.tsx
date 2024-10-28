import { useState, useCallback, useEffect, useMemo, createContext, PropsWithChildren } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { GameModeEnum, GameSizeEnum, GameSettings } from '../types';
import useFetch from '../hooks/useFetch';

const DEFAULT_GAME_SETTINGS = Object.freeze({
  mode: GameModeEnum.SINGLE_PLAYER,
  size: GameSizeEnum.DEFAULT,
});

export type GameRoomContextProps = {
  readonly gameSettings: GameSettings;
  setGameSettings: (settings: any) => void;
  startNewGame: () => Promise<void>;
  backToHome: () => void;
};

export const GameRoomContext = createContext<GameRoomContextProps>({} as GameRoomContextProps);

const useGameRoomContextValues = () => {
  const { postData } = useFetch();
  const { roomId } = useParams();
  const [queryParams, setQueryParams] = useSearchParams();
  const [gameSettings, setGameSettings] = useState({ ...DEFAULT_GAME_SETTINGS } as GameSettings);
  const navigateTo = useNavigate();

  const startNewGame = useCallback(
    async (): Promise<void> => {
      try {
        const res = await postData('/api/rooms', null);
        if (res) {
          let routePath = '/game-room';
          if (gameSettings.mode === GameModeEnum.ONLINE) {
            routePath += `/${res.roomId}?size=${gameSettings.size}`;
          } else {
            routePath += `?mode=${gameSettings.mode}&size=${gameSettings.size}`;
          }
          navigateTo(routePath, { replace: true });
        };
      } catch (error) {
        console.error(error);
      }
    },
    [gameSettings, postData, navigateTo],
  );

  const backToHome = useCallback(
    () => {
      setQueryParams((prev) => {
        prev.delete('mode');
        prev.delete('size');
        return prev;
      });
      setGameSettings({ ...DEFAULT_GAME_SETTINGS });
      navigateTo('/');
    },
    [navigateTo, setQueryParams],
  );

  useEffect(
    () => {
      setGameSettings((prev) => {
        const next = { ...prev } as GameSettings;
        next.mode = roomId ? GameModeEnum.ONLINE : (queryParams.get('mode') || GameModeEnum.SINGLE_PLAYER) as GameModeEnum;
        next.size = Number(queryParams.get('size')) || GameSizeEnum.DEFAULT;
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const memoedValues: GameRoomContextProps = useMemo(
    () => ({
      gameSettings,
      setGameSettings,
      startNewGame,
      backToHome,
    }),
    [
      gameSettings,
      setGameSettings,
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
