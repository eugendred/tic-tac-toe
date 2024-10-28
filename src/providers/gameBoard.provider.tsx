import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  createContext,
  PropsWithChildren,
} from 'react';

import { useFetch, useGameRoom } from '../hooks';
import { GameHistoryAction, IGameHistoryAction } from '../utils';
import { GameStateProps, GameModeEnum, GameLevelEnum, GamePlayerEnum, GameSettings } from '../types';

const DEFAULT_GAME_STATE = Object.freeze({
  player: GamePlayerEnum.X,
  winner: '',
  isOver: false,
  replaying: false,
  loading: false,
});

export type GameBoardContextProps = {
  readonly gameSettings: GameSettings;
  readonly boardState: string[];
  readonly gameState: GameStateProps;
  readonly gameLevel: GameLevelEnum;
  readonly gameHistory: IGameHistoryAction[];
  setGameLevel: (level: GameLevelEnum) => void,
  setLoading: (loading: boolean) => void,
  setReplaying: (state: boolean) => void,
  addToHistory: (player: string, position: number) => void,
  initGame: () => void,
  restartGame: () => void,
  replayGame: () => void,
  makeMove: (state: string[], moveIdx: number) => Promise<void>,
  undoMove: () => void,
  passMoveToPlayer: (player: GamePlayerEnum) => void;
  backToHome: () => void;
};

export const GameBoardContext = createContext<GameBoardContextProps>({} as GameBoardContextProps);

const useGameBoardContextValues = () => {
  const { postData } = useFetch();
  const { gameSettings, backToHome } = useGameRoom();
  const [boardState, setBoardState] = useState(Array.from({ length: gameSettings.size ** 2 }).fill('') as string[]);
  const [gameHistory, setGameHistory] = useState([] as GameHistoryAction[]);
  const [gameLevel, setGameLevel] = useState(GameLevelEnum.EASY);
  const [gameState, setGameState] = useState({ ...DEFAULT_GAME_STATE } as GameStateProps);
  const timeoutRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const resetBoardState = (size: number) => {
    setBoardState(Array.from({ length: size ** 2 }).fill('') as string[]);
  };

  const resetGameState = () => {
    setGameState({ ...DEFAULT_GAME_STATE });
  };

  const passMoveToPlayer = useCallback(
    (player: GamePlayerEnum) => {
      setGameState((prev) => ({ ...prev, player }));
    },
    [],
  );

  const validatePlayerMove = useCallback(
    async (board: string[]) => {
      return postData('/api/make-move', { mode: gameSettings.mode, board, level: gameLevel });
    },
    [gameSettings.mode, gameLevel, postData],
  );

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
      setGameHistory((prev) => ([ ...prev, new GameHistoryAction(player, position)]));
    },
    [],
  );

  const initGame = useCallback(
    () => {
      resetGameState();
      resetBoardState(gameSettings.size);
      setGameHistory([]);
    },
    [gameSettings.size],
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
    async (nextState: string[]): Promise<void> => {
      try {
        setLoading(true);
        const res = await validatePlayerMove(nextState);
        if (res) {
          setBoardState([...res.board]);
          setGameState((prev) => ({ ...prev, ...res.gameState }));
          if (gameSettings.mode === GameModeEnum.MULTIPLAYER) {
            passMoveToPlayer(gameState.player === GamePlayerEnum.X ? GamePlayerEnum.O : GamePlayerEnum.X);
          }
          addToHistory(GamePlayerEnum.O, res.moveIdx);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [gameSettings.mode, gameState.player, validatePlayerMove, addToHistory, setLoading, passMoveToPlayer],
  );

  const undoMove = useCallback(
    () => {
      if (gameSettings.mode !== GameModeEnum.SINGLE_PLAYER || gameState.replaying) return;
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
    [gameSettings.mode, gameState.replaying, gameState.isOver, gameHistory],
  );

  const replayGame = useCallback(
    () => {
      setReplaying(true);
      resetBoardState(gameSettings.size);
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
    [gameSettings.size, gameHistory, setReplaying],
  );

  useEffect(() => {
    resetBoardState(gameSettings.size);
  }, [gameSettings.size]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const memoedValues: GameBoardContextProps = useMemo(
    () => ({

      boardState,
      gameState,
      gameLevel,
      gameSettings,
      gameHistory,
      setGameLevel,
      setLoading,
      setReplaying,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
      passMoveToPlayer,
      backToHome,
    }),
    [
      boardState,
      gameState,
      gameLevel,
      gameSettings,
      gameHistory,
      setGameLevel,
      setLoading,
      setReplaying,
      addToHistory,
      initGame,
      restartGame,
      replayGame,
      makeMove,
      undoMove,
      passMoveToPlayer,
      backToHome,
    ],
  );

  return memoedValues;
};

export const GameBoardContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useGameBoardContextValues();

  return <GameBoardContext.Provider value={values}>{children}</GameBoardContext.Provider>;
};
