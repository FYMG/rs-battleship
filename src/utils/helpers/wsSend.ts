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
    data?: Record<PropertyKey, unknown>;
    error?: boolean;
    errorText?: string;
  }
) {
  const msg = JSON.stringify({
    type,
    data: JSON.stringify({
      ...data,
      error,
      errorText,
    }),
    id: 0,
  });

  console.log('ws response: ', msg);

  ws.send(msg);
}

export default wsSend;
