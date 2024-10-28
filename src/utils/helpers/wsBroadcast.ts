import { WebSocket } from 'ws';
import { wsTypes } from '../consts';

function wsBroadcast(
  ws: WebSocket[],
  {
    type,
    data,
    error = false,
    errorText = '',
  }: {
    type: (typeof wsTypes)[keyof typeof wsTypes];
    data: Record<PropertyKey, any>;
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

  ws.forEach((w) => w.send(msg));

  console.log(`ws broadcast: ${msg} to ${ws.length} clients`);
}

export default wsBroadcast;
