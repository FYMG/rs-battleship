import IHandleDataParams from '../../../models/HandleDataParams';
import validateObject from '../../../utils/helpers/validateObject';
import { IShip } from '../../../models/Game';
import { gamesMap } from '../../../data';
import wsSend from '../../../utils/helpers/wsSend';
import { wsTypes } from '../../../utils/consts';

const gameAddShipsSchema = {
  gameId: 'string',
  indexPlayer: 'string',
  ships: [
    {
      position: {
        x: 'number',
        y: 'number',
      },
      direction: 'boolean',
      length: 'number',
      type: 'string',
    },
  ],
};

function handleGameAddShips(params: IHandleDataParams) {
  const { ws, data } = params;
  validateObject(gameAddShipsSchema, data.data);
  const { gameId, ships, indexPlayer } = data.data as unknown as {
    gameId: string;
    ships: IShip[];
    indexPlayer: string;
  };
  const game = gamesMap.get(gameId);
  if (!game) {
    wsSend(ws, {
      type: wsTypes.addShip,
      error: true,
      errorText: 'Game not found',
      withError: true,
    });
    return;
  }

  if (game.gameStarted) {
    wsSend(ws, {
      type: wsTypes.addShip,
      error: true,
      errorText: 'Game already started',
      withError: true,
    });
    return;
  }

  game.addShips(indexPlayer, ships);
}

export default handleGameAddShips;
