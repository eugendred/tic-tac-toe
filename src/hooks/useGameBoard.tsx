import { useContext } from 'react';

import { GameBoardContext } from '../providers/gameBoard.provider';

const useGameBoard = () => useContext(GameBoardContext);

export default useGameBoard;
