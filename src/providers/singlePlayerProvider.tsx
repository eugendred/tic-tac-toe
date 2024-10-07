import { useState, useCallback, useEffect, useMemo, useRef, createContext, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch';
import { GameHistoryAction, IGameHistoryAction } from '../utils';
import { GameStateProps, GameModeEnum, GameLevelEnum } from '../types';

const DEFAULT_BOARD_SIZE = 3;

export type SinglePlayerContextProps = {
  readonly boardSize: number;
  readonly boardState: string[];
  readonly gameState: GameStateProps;
  readonly gameLevel: GameLevelEnum;
  readonly gameMode: GameModeEnum;
  readonly gameHistory: IGameHistoryAction[];
  setBoardSize: (size: number) => void;
  setGameLevel: (level: GameLevelEnum) => void,
  setGameMode: (mode: GameModeEnum) => void,
  setLoading: (loading: boolean) => void,
  setReplaying: (state: boolean) => void,
  addToHistory: (player: string, position: number) => void,
  initGame: () => void,
  restartGame: () => void,
  replayGame: () => void,
  makeMove: (state: string[], moveIdx: number) => Promise<void>,
  undoMove: () => void,
  startNewGame: () => Promise<void>,
};

export const SinglePlayerContext = createContext<SinglePlayerContextProps>({} as SinglePlayerContextProps);

const useComposedSinglePlayer = () => {
  const { postData } = useFetch();
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [boardState, setBoardState] = useState(Array.from({ length: boardSize * boardSize }).fill('') as string[]);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameLevel, setGameLevel] = useState(GameLevelEnum.EASY);
  const [gameMode, setGameMode] = useState(GameModeEnum.SINGLE_GAME);
  const [gameState, setGameState] = useState({
    winner: '',
    isOver: false,
    replaying: false,
    loading: false,
  });
  const navigateTo = useNavigate();
  const timeoutRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const resetBoardState = (boardSize: number) => {
    setBoardState(Array.from({ length: boardSize * boardSize }).fill('') as string[]);
  };

  const resetGameState = () => {
    setGameState({
      winner: '',
      isOver: false,
      replaying: false,
      loading: false,
    });
  };

  const setLoading = useCallback(
    (loading: boolean) => {
      setGameState((prev) => ({ ...prev, loading }));
    },
    [],
  );

  const setReplaying = useCallback(
    (replaying: boolean) => {
      setGameState((prev) => ({ ...prev, replaying }));
    },
    [],
  );

  const addToHistory = useCallback(
    (player: string, position: number) => {
      setGameHistory((prev): any => ([ ...prev, new GameHistoryAction(player, position)]));
    },
    [],
  );

  const initGame = useCallback(
    () => {
      resetGameState();
      resetBoardState(boardSize);
      setGameHistory([]);
    },
    [boardSize],
  );

  const restartGame = useCallback(
    () => {
      if (gameState.replaying) return;
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        initGame();
        setLoading(false);
      }, 1000);
    },
    [gameState.replaying, initGame, setLoading],
  );

  const makeMove = useCallback(
    async (nextState: Array<string | null>, moveIdx: number): Promise<void> => {
      try {
        setLoading(true);
        const res = await postData('/api/make-move', {
          board: nextState,
          level: gameLevel,
          moveIdx,
        });
        if (res) {
          setBoardState([...res.board]);
          setGameState((prev) => ({ ...prev, ...res.gameState }));
          addToHistory('O', res.moveIdx);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [gameLevel, postData, addToHistory, setLoading],
  );

  const undoMove = useCallback(
    () => {
      if (gameState.replaying) return;
      setBoardState((prev) => {
        const [lastMoveX, lastMoveO]: Array<GameHistoryAction> = gameHistory.slice(-2);
        if (!lastMoveX || !lastMoveO) return prev;
        const next = [...prev];
        next[lastMoveX.position] = '';
        next[lastMoveO.position] = '';
        return next;
      });
      setGameHistory(() => gameHistory.slice(0, -2));
      if (gameState.isOver) resetGameState();
    },
    [gameState.replaying, gameState.isOver, gameHistory],
  );

  const replayGame = useCallback(
    () => {
      setReplaying(true);
      resetBoardState(boardSize);
      const moves = [...gameHistory];
      intervalRef.current = setInterval(() => {
        const move: any = moves.shift();
        if (move) {
          setBoardState((prev) => {
            const next = [...prev];
            next[move.position] = move.player;
            return next;
          });
        } else {
          clearInterval(intervalRef.current);
          setReplaying(false);
        }
      }, 1000);
    },
    [boardSize, gameHistory, setReplaying],
  );

  const startNewGame = useCallback(
    async (): Promise<void> => {
      try {
        const res = await postData('/api/rooms', null);
        if (res) navigateTo(`/single-player/${res.roomId}`, { replace: true });
      } catch (error) {
        console.error(error);
      }
    },
    [postData, navigateTo],
  );

  useEffect(() => {
    resetBoardState(boardSize);
  }, [boardSize]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const memoedValues: SinglePlayerContextProps = useMemo(
    () => ({
      boardSize,
      boardState,
      gameState,
      gameLevel,
      gameMode,
      gameHistory,
      setBoardSize,
      setGameLevel,
      setLoading,
      setReplaying,
      setGameMode,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
      startNewGame,
    }),
    [
      boardSize,
      boardState,
      gameState,
      gameLevel,
      gameMode,
      gameHistory,
      setBoardSize,
      setGameLevel,
      setLoading,
      setReplaying,
      setGameMode,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
      startNewGame,
    ],
  );

  return memoedValues;
};

export const SinglePlayerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useComposedSinglePlayer();

  return <SinglePlayerContext.Provider value={values}>{children}</SinglePlayerContext.Provider>;
};
