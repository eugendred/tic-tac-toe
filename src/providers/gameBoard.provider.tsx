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
import { GameHistoryAction } from '../utils';
import { GameStateProps, GameModeEnum, GameLevelEnum, GamePlayerEnum, GameSettings } from '../types';

const DEFAULT_GAME_STATE = Object.freeze({
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
  readonly playerTurn: GamePlayerEnum;
  setGameLevel: (level: GameLevelEnum) => void,
  restartGame: () => void,
  replayGame: () => void,
  undoMove: () => void,
  backToHome: () => void;
  makeMove: (moveIdx: number) => Promise<void>,
};

export const GameBoardContext = createContext<GameBoardContextProps>({} as GameBoardContextProps);

const useGameBoardContextValues = () => {
  const { postData } = useFetch();
  const { gameSettings, backToHome } = useGameRoom();
  const [boardState, setBoardState] = useState(Array.from({ length: gameSettings.size ** 2 }).fill('') as string[]);
  const [gameHistory, setGameHistory] = useState([] as GameHistoryAction[]);
  const [gameLevel, setGameLevel] = useState(GameLevelEnum.EASY);
  const [gameState, setGameState] = useState({ ...DEFAULT_GAME_STATE } as GameStateProps);
  const [playerTurn, setPlayerTurn] = useState(GamePlayerEnum.X);
  const intervalRef = useRef<any>(null);

  const resetBoardState = (size: number) => {
    setBoardState(Array.from({ length: size ** 2 }).fill('') as string[]);
    setPlayerTurn(GamePlayerEnum.X);
  };

  const resetGameState = () => {
    setGameState({ ...DEFAULT_GAME_STATE });
  };

  const turnMoveToPlayer = useCallback(
    (player?: GamePlayerEnum) => {
      setPlayerTurn((prev) => {
        return player || prev === GamePlayerEnum.X ? GamePlayerEnum.O : GamePlayerEnum.X;
      });
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
    (player: GamePlayerEnum, idx: number) => {
      setGameHistory((prev) => ([ ...prev, new GameHistoryAction(player, idx)]));
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
    async () => {
      if (gameState.replaying) return;
      try {
        setLoading(true);
        await postData('/api/new-game', null);
        initGame();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [gameState.replaying, setLoading, postData, initGame],
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
      if (gameState.isOver) {
        resetGameState();
      }
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

  const makeMove = useCallback(
    async (moveIdx: number): Promise<void> => {
      const nextBoard: string[] = [...boardState];
      nextBoard[moveIdx] = playerTurn;
      setBoardState(nextBoard);
      addToHistory(playerTurn, moveIdx);
      turnMoveToPlayer();

      try {
        setLoading(true);
        const res = await validatePlayerMove(nextBoard);
        if (!res) return;
        setGameState((prev) => ({ ...prev, ...res.gameState }));
        setBoardState([...res.board]);
        if (gameSettings.mode === GameModeEnum.SINGLE_PLAYER) {
          addToHistory(GamePlayerEnum.O, res.moveIdx);
          turnMoveToPlayer();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [
      boardState,
      playerTurn,
      gameSettings.mode,
      setLoading,
      validatePlayerMove,
      turnMoveToPlayer,
      addToHistory,
    ],
  );

  useEffect(() => {
    resetBoardState(gameSettings.size);
  }, [gameSettings.size]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const memoedValues: GameBoardContextProps = useMemo(
    () => ({
      boardState,
      gameState,
      gameLevel,
      gameSettings,
      playerTurn,
      setGameLevel,
      restartGame,
      replayGame,
      undoMove,
      makeMove,
      backToHome,
    }),
    [
      boardState,
      gameState,
      gameLevel,
      gameSettings,
      playerTurn,
      setGameLevel,
      restartGame,
      replayGame,
      undoMove,
      makeMove,
      backToHome,
    ],
  );

  return memoedValues;
};

export const GameBoardContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const values = useGameBoardContextValues();

  return <GameBoardContext.Provider value={values}>{children}</GameBoardContext.Provider>;
};
