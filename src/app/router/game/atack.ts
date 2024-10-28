import IHandleDataParams from '../../../models/HandleDataParams';
import wsSend from '../../../utils/helpers/wsSend';
import validateObject from '../../../utils/helpers/validateObject';
import { gamesMap } from '../../../data';
import { wsTypes } from '../../../utils/consts';

const gameAttackShipsSchema = {
  gameId: 'string',
  x: 'number',
  y: 'number',
  indexPlayer: 'string',
};

function handleAttackShips(params: IHandleDataParams) {
  const { ws, data } = params;
  validateObject(gameAttackShipsSchema, data.data);
  const { gameId, x, y, indexPlayer } = data.data as unknown as {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
  };
  const game = gamesMap.get(gameId);
  if (!game) {
    wsSend(ws, {
      type: wsTypes.attack,
      error: true,
      errorText: 'Game not found',
      withError: true,
    });
    return;
  }

  if (game.currentPlayerIndex !== indexPlayer) {
    wsSend(ws, {
      type: wsTypes.attack,
      error: true,
      errorText: 'Not your turn',
      withError: true,
    });
    return;
  }

  const results = game.attack(indexPlayer, x, y);

  results.forEach((result) => {
    wsSend(game.player1.ws!, {
      type: wsTypes.attack,
      data: result,
    });
    wsSend(game.player2.ws!, {
      type: wsTypes.attack,
      data: result,
    });
  });

  wsSend(game.player1.ws!, {
    type: wsTypes.turn,
    data: {
      currentPlayer: game.currentPlayerIndex,
    },
  });
  wsSend(game.player2.ws!, {
    type: wsTypes.turn,
    data: {
      currentPlayer: game.currentPlayerIndex,
    },
  });
}

export default handleAttackShips;
