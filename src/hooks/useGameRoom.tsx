import { useContext } from 'react';

import { GameRoomContext } from '../providers/gameRoom.provider';

const useGameRoom = () => useContext(GameRoomContext);

export default useGameRoom;
