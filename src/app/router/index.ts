import { WebSocket } from 'ws';
import * as console from 'node:console';
import { t } from '../../utils/loc';
import parseRequest from '../../utils/helpers/parseJSON';
import { wsTypes } from '../../utils/consts';
import { IWsRequest, wsRequestSchema } from '../../models/wsRequest';
import validateObject from '../../utils/helpers/validateObject';

export interface HandleMessageParams {
  ws: WebSocket;
  message: string;
  clientId: string;
  clients: Map<string, WebSocket>;
}

function handleMessage({ ws, message, clientId }: HandleMessageParams) {
  console.log(t('ws-client-message', { clientId, message }));
  try {
    const data = parseRequest<IWsRequest>(message);
    if (typeof data.data === 'string') {
      data.data = parseRequest(data.data);
    }
    validateObject(wsRequestSchema, data);
    console.log(data);

    ws.send('Hello from server');
  } catch (error) {
    if (error instanceof Error) {
      ws.send(
        JSON.stringify({
          type: wsTypes.unknown,
          data: {
            error: true,
            errorText: error.message,
          },
          id: 0,
        })
      );
      console.log('ws error: ', error.message);
    } else {
      ws.send(
        JSON.stringify({
          type: wsTypes.unknown,
          data: {
            error: true,
            errorText: t('server-unknown-error'),
          },
          id: 0,
        })
      );
    }
  }
}

export default handleMessage;
