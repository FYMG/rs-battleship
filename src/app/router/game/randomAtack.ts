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
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
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
