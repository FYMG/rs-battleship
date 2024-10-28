import { WebSocket } from 'ws';
import * as console from 'node:console';
import { wsTypes } from '../consts';

function wsSend(
  ws: WebSocket,
  {
    type,
    data = {},
    error = false,
    errorText = '',
  }: {
    type: (typeof wsTypes)[keyof typeof wsTypes];
    data?: any;
    error?: boolean;
    errorText?: string;
  },
  withError = false
) {
  const msg = JSON.stringify({
    type,
    data: withError
      ? JSON.stringify({
          ...data,
          error,
          errorText,
        })
      : JSON.stringify(data),
    id: 0,
  });

  console.log('ws response: ', msg);

  ws.send(msg);
}

export default wsSend;
