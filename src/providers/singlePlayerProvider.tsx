import { useState, useCallback, useEffect, useMemo, useRef, createContext, PropsWithChildren } from 'react';

import useFetch from '../hooks/useFetch';
import { GameHistoryAction, IGameHistoryAction, GameLevelEnum } from '../utils';

const DEFAULT_BOARD_SIZE = 3;

export type GameStateProps = {
  gameOver: boolean;
  winner: string;
};

export type SinglePlayerContextProps = {
  readonly boardSize: number;
  readonly boardState: string[];
  readonly gameState: GameStateProps;
  readonly gameLevel: GameLevelEnum;
  readonly gameHistory: IGameHistoryAction[];
  readonly loading: boolean;
  readonly replaying: boolean;
  setBoardSize: (size: number) => void;
  setLoading: (state: boolean) => void,
  setGameLevel: (level: GameLevelEnum) => void,
  addToHistory: (player: string, position: number) => void,
  initGame: () => void,
  restartGame: () => void,
  replayGame: () => void,
  makeMove: (state: string[], moveIdx: number) => void,
  undoMove: () => void,
};

export const SinglePlayerContext = createContext<SinglePlayerContextProps>({} as SinglePlayerContextProps);

const useComposedSinglePlayer = () => {
  const { postData } = useFetch();
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [boardState, setBoardState] = useState(Array.from({ length: boardSize * boardSize }).fill('') as string[]);
  const [gameHistory, setGameHistory] = useState([]);
  const [gameState, setGameState] = useState({ gameOver: false, winner: '' });
  const [gameLevel, setGameLevel] = useState(GameLevelEnum.EASY);
  const [loading, setLoading] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const timeoutRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const resetBoardState = (boardSize: number) => {
    setBoardState(Array.from({ length: boardSize * boardSize }).fill('') as string[]);
  };

  const resetGameState = () => {
    setGameState({ gameOver: false, winner: '' });
  };

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
      setReplaying(false);
    },
    [boardSize],
  );

  const restartGame = useCallback(
    () => {
      if (replaying) return;
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        initGame();
        setLoading(false);
      }, 1500);
    },
    [replaying, initGame],
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
          setGameState({...res.gameState });
          addToHistory('O', res.moveIdx);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [gameLevel, postData, addToHistory],
  );

  const undoMove = useCallback(
    () => {
      if (replaying) return;
      setBoardState((prev) => {
        const [lastMoveX, lastMoveO]: Array<GameHistoryAction> = gameHistory.slice(-2);
        const next = [...prev];
        next[lastMoveX.position] = '';
        next[lastMoveO.position] = '';
        return next;
      });
      setGameHistory(() => gameHistory.slice(0, -2));
      if (gameState.gameOver) {
        resetGameState();
      }
    },
    [gameState, gameHistory, replaying],
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
    [boardSize, gameHistory],
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
      gameHistory,
      loading,
      replaying,
      setBoardSize,
      setGameLevel,
      setLoading,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
    }),
    [
      boardSize,
      boardState,
      gameState,
      gameLevel,
      gameHistory,
      loading,
      replaying,
      setBoardSize,
      setGameLevel,
      setLoading,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
    ],
  );

  return memoedValues;
};

export const SinglePlayerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useComposedSinglePlayer();

  return <SinglePlayerContext.Provider value={values}>{children}</SinglePlayerContext.Provider>;
};
