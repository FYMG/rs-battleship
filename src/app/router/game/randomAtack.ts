import * as crypto from 'node:crypto';
import IHandleDataParams from '../../../models/HandleDataParams';
import validateObject from '../../../utils/helpers/validateObject';
import handleAttackShips from './atack';

const gameRandomAttackShipsSchema = {
  gameId: 'string',
  indexPlayer: 'string',
};

function handleRandomAttackShips(params: IHandleDataParams) {
  const { data } = params;
  validateObject(gameRandomAttackShipsSchema, data.data);
  const newData = {
    ...data.data,
    x: crypto.randomInt(1, 11),
    y: crypto.randomInt(1, 11),
  };
  handleAttackShips({
    ...params,
    data: {
      ...data,
      data: newData,
    },
  });
}

export default handleRandomAttackShips;
