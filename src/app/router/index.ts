import * as console from 'node:console';
import { t } from '../../utils/loc';
import parseRequest from '../../utils/helpers/parseJSON';
import { wsTypes } from '../../utils/consts';
import { IWsRequest, wsRequestSchema } from '../../models/wsRequest';
import validateObject from '../../utils/helpers/validateObject';
import IHandleMessageParams from '../../models/HandleMessageParams';
import handleRegUser from './user/reg';
import wsSend from '../../utils/helpers/wsSend';

function handleMessage(params: IHandleMessageParams) {
  const { ws, message, clientId } = params;
  console.log(t('ws-client-message', { clientId, message }));
  try {
    const data = parseRequest<IWsRequest>(message);
    if (typeof data.data === 'string') {
      data.data = parseRequest(data.data);
    }
    validateObject(wsRequestSchema, data);
    console.log(data);
    const { type } = data;
    const handleParams = {
      ...params,
      data,
    };

    switch (type) {
      case wsTypes.reg:
        handleRegUser(handleParams);
        break;
      default:
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : t('server-unknown-error');
    wsSend(ws, {
      type: wsTypes.error,
      error: true,
      errorText: message,
    });
    console.log('ws error:', message);
  }
}

export default handleMessage;
