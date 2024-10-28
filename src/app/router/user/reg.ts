import IHandleDataParams from '../../../models/HandleDataParams';
import validateObject from '../../../utils/helpers/validateObject';
import { getUserByName, usersMap } from '../../../data';
import { wsTypes } from '../../../utils/consts';
import wsSend from '../../../utils/helpers/wsSend';
import { t } from '../../../utils/loc';
import updateWinnersBroadcast from './updateWinnersBroadcast';
import updateWinners from './updateWinners';
import updateRoom from '../room/update';

interface IRegData {
  name: string;
  password: string;
}

function handleRegUser(params: IHandleDataParams) {
  const { ws, data, clientId } = params;
  validateObject(
    {
      name: 'string',
      password: 'string',
    },
    data.data
  );
  const { name, password } = data.data as unknown as IRegData;
  let user = getUserByName(name);
  const userExists = user !== undefined;
  user = user ?? {
    name,
    password,
    wins: 0,
    clientId,
    ws,
  };

  if (user.password !== password) {
    wsSend(ws, {
      type: wsTypes.reg,
      error: true,
      errorText: t('wrong-reg-data'),
      data: {
        name,
        index: clientId,
      },
    });
    return;
  }

  user.ws = ws;
  user.clientId = clientId;

  usersMap.set(clientId, user);

  wsSend(
    ws,
    {
      type: wsTypes.reg,
      data: {
        name,
        index: clientId,
      },
    },
    true
  );

  if (!userExists) {
    updateWinnersBroadcast(params);
  } else {
    updateWinners(params);
  }

  updateRoom(params);
}

export default handleRegUser;
