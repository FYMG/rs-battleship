import IHandleDataParams from '../../../models/HandleDataParams';
import { createRoom, gamesMap, getUserByClientId } from '../../../data';
import { wsTypes } from '../../../utils/consts';
import wsSend from '../../../utils/helpers/wsSend';
import Game, { IShip } from '../../../models/Game';
import IUser from '../../../models/IUser';

const gameField = [
  {
    position: { x: 4, y: 0 },
    direction: true,
    type: 'huge',
    length: 4,
  },
  {
    position: { x: 0, y: 5 },
    direction: true,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 2, y: 5 },
    direction: true,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 7, y: 4 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 0, y: 0 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 5, y: 7 },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 4, y: 5 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 3, y: 9 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 0, y: 2 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 2, y: 2 },
    direction: true,
    type: 'small',
    length: 1,
  },
] as IShip[];

function handleSinglePlay(params: IHandleDataParams) {
  const { ws, clientId } = params;
  const user = getUserByClientId(clientId) as IUser;
  if (!user) {
    wsSend(ws, {
      type: wsTypes.single_play,
      error: true,
      errorText: 'User not found',
      withError: true,
    });
  }
  const room = createRoom();

  room.roomUsers.push({
    name: user.name,
    index: user.clientId,
  });
  room.roomUsers.push({
    name: 'BOT',
    index: '-1',
  });
  room.gameStarted = true;

  const game = new Game({
    room,
    player1: {
      ...user,
      index: String(5),
    },
    player2: {
      name: 'BOT',
      password: 'BOT4241',
      wins: 0,
      clientId: '-1',
      ws: null,
      index: String(-1),
    },
    singlePlayer: true,
  });

  wsSend(user.ws!, {
    type: wsTypes.create_game,
    data: {
      idGame: game.id,
      idPlayer: game.player1.index,
    },
  });

  gamesMap.set(room.roomId, game);

  game.addShips(String('-1'), gameField);
}

export default handleSinglePlay;
