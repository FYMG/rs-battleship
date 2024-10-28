import * as console from 'node:console';
import { t } from '../../utils/loc';
import parseRequest from '../../utils/helpers/parseJSON';
import { wsTypes } from '../../utils/consts';
import { IWsRequest, wsRequestSchema } from '../../models/wsRequest';
import validateObject from '../../utils/helpers/validateObject';
import IHandleMessageParams from '../../models/HandleMessageParams';
import handleRegUser from './user/reg';
import wsSend from '../../utils/helpers/wsSend';
import handleCreateRoom from './room/create';

function handleMessage(params: IHandleMessageParams) {
  const { ws, message, clientId } = params;
  console.log(t('ws-client-message', { clientId, message }));
  try {
    const data = parseRequest<IWsRequest>(message);
    if (typeof data.data === 'string') data.data = parseRequest(data.data);
    validateObject(wsRequestSchema, data);
    const { type } = data;
    const handleParams = {
      ...params,
      data,
    };

    switch (type) {
      case wsTypes.reg:
        handleRegUser(handleParams);
        break;
      case wsTypes.createRoom:
        handleCreateRoom(handleParams);
        break;
      default:
        break;
    }
  } catch (error) {
    const errorText = error instanceof Error ? error.message : t('server-unknown-error');
    wsSend(ws, {
      type: wsTypes.error,
      error: true,
      errorText,
    });
    console.log('ws error:', errorText);
  }
}

export default handleMessage;
