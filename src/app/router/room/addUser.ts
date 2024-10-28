import IHandleDataParams from '../../../models/HandleDataParams';
import validateObject from '../../../utils/helpers/validateObject';
import { gamesMap, getRoomById, getUserByClientId, getUserByName } from '../../../data';
import wsSend from '../../../utils/helpers/wsSend';
import { wsTypes } from '../../../utils/consts';
import updateRoomBroadcast from './updateBroadcast';
import Game from '../../../models/Game';

const addUserDataSchema = {
  indexRoom: 'string',
};

function handleAddUserToRoom(params: IHandleDataParams) {
  const { ws, data, clientId } = params;
  validateObject(addUserDataSchema, data.data);
  const { indexRoom } = data.data as unknown as { indexRoom: string };
  const room = getRoomById(indexRoom);
  const user = getUserByClientId(clientId);

  if (!user) {
    wsSend(ws, {
      type: wsTypes.addUserToRoom,
      error: true,
      errorText: 'User not found',
      withError: true,
    });
    return;
  }

  if (!room) {
    wsSend(ws, {
      type: wsTypes.addUserToRoom,
      error: true,
      errorText: 'Room not found',
      withError: true,
    });
    return;
  }

  if (room.roomUsers.find((p) => p.name === user.name)) {
    wsSend(ws, {
      type: wsTypes.addUserToRoom,
      error: true,
      errorText: 'User already in room',
      withError: true,
    });
    return;
  }

  room.roomUsers.push({
    name: user.name,
    index: clientId,
  });

  if (room.roomUsers.length === 2) {
    room.gameStarted = true;
    const opponent = getUserByName(
      room.roomUsers.find((p) => p.name !== user.name)!.name
    );

    if (!opponent?.ws) {
      wsSend(ws, {
        type: wsTypes.addUserToRoom,
        error: true,
        errorText: 'Opponent not found',
        withError: true,
      });
      return;
    }

    const indexPlayer = Math.random() > 0.5 ? 0 : 1;

    const game = new Game({
      room,
      player1: {
        ...user,
        index: String(indexPlayer),
      },
      player2: {
        ...opponent,
        index: String(indexPlayer + 1),
      },
    });

    wsSend(opponent.ws, {
      type: wsTypes.create_game,
      data: {
        idGame: game.id,
        idPlayer: game.player1.index,
      },
    });

    wsSend(ws, {
      type: wsTypes.create_game,
      data: {
        idGame: game.id,
        idPlayer: game.player2.index,
      },
    });

    gamesMap.set(game.id, game);
  }

  updateRoomBroadcast();
}

export default handleAddUserToRoom;
