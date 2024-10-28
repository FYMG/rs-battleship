import IHandleDataParams from '../../../models/HandleDataParams';
import validateObject from '../../../utils/helpers/validateObject';
import { getUserByName, usersMap } from '../../../data';
import { wsTypes } from '../../../utils/consts';
import wsSend from '../../../utils/helpers/wsSend';
import { t } from '../../../utils/loc';
import updateWinners from './updateWinners';

interface IRegData {
  name: string;
  password: string;
}

function handleRegUser({ ws, data, clientId }: IHandleDataParams) {
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

  wsSend(ws, {
    type: wsTypes.reg,
    data: {
      name,
      index: clientId,
    },
  });

  if (!userExists) {
    updateWinners();
  }
}

export default handleRegUser;
