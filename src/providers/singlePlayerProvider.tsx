import { useState, useCallback, useEffect, useMemo, useRef, createContext } from 'react';

import useFetch from '../hooks/useFetch';
import GameHistoryAction from '../utils/gameHistory';

const DEFAULT_BOARD_SIZE = 3;

export type GameState = {
  gameOver: boolean;
  isDraw: boolean;
  winner: string;
};

export const SinglePlayerContext = createContext({
  boardSize: DEFAULT_BOARD_SIZE,
  boardState: [],
  gameHistory: [],
  gameState: {
    gameOver: false,
    isDraw: false,
    winner: '',
  },
  loading: false,
  setBoardSize: (size: number) => null,
  setLoading: (state: boolean) => null,
  initGame: () => null,
  restartGame: () => null,
  replayGame: () => null,
  makeMove: (state: Array<string | null>) => null,
  undoMove: () => null,
  addToHistory: (player: string, position: number) => null,
});

const useComposedSinglePlayer = () => {
  const { postData } = useFetch();
  const [boardSize, setBoardSize] = useState(DEFAULT_BOARD_SIZE);
  const [boardState, setBoardState] = useState(Array.from({ length: boardSize * boardSize }).fill(''));
  const [gameHistory, setGameHistory] = useState([]);
  const [gameState, setGameState] = useState({
    gameOver: false,
    isDraw: false,
    winner: '',
  } as GameState);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(undefined);

  const resetBoardState = (boardSize: number) => {
    setBoardState(Array.from({ length: boardSize * boardSize }).fill(''));
  };

  const resetGameState = () => {
    setGameState({
      gameOver: false,
      isDraw: false,
      winner: '',
    });
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
    },
    [boardSize],
  );

  const restartGame = useCallback(
    () => {
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        initGame();
        setLoading(false);
      }, 1500);
    },
    [initGame],
  );

  const makeMove = useCallback(
    async (nextState: Array<string | null>): Promise<void> => {
      try {
        setLoading(true);
        const res = await postData('/api/make-move', { board: nextState });
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
    [postData, addToHistory],
  );

  const undoMove = useCallback(
    () => {
      setBoardState((prev) => {
        const [lastMoveX, lastMoveO] = gameHistory.slice(-2);
        const next = [...prev];
        next[lastMoveX.position] = '';
        next[lastMoveO.position] = '';
        return next;
      });
      setGameHistory(() => gameHistory.slice(0, -2));
      if (gameState.gameOver) {
        setGameState({
          gameOver: false,
          isDraw: false,
          winner: '',
        });
      }
    },
    [gameState, gameHistory],
  );

  const replayGame = useCallback(
    () => {
      resetBoardState(boardSize);
      const moves = [...gameHistory];
      const intervalId = setInterval(() => {
        const move = moves.shift();
        if (!move) return clearInterval(intervalId);
        setBoardState((prev) => {
          const next = [...prev];
          next[move.position] = move.player;
          return next;
        });
      }, 1000);
    },
    [boardSize, gameHistory],
  );

  const memoedValues = useMemo(
    () => ({
      boardSize,
      boardState,
      gameState,
      gameHistory,
      loading,
      setBoardSize,
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
      gameHistory,
      loading,
      setBoardSize,
      setLoading,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
    ],
  );

  useEffect(() => {
    resetBoardState(boardSize);
  }, [boardSize]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return memoedValues;
};

export const SinglePlayerContextProvider: any = ({ children }: any) => {
  const values = useComposedSinglePlayer();

  return <SinglePlayerContext.Provider value={values}>{children}</SinglePlayerContext.Provider>;
};
