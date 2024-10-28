import { WebSocketServer, WebSocket } from 'ws';
import * as console from 'node:console';
import { t } from '../utils/loc';
import handleMessage from './router';

export interface StartParams {
  port: number;
}

function start({ port }: StartParams) {
  const clients = new Map<string, WebSocket>();
  let id = 0;

  const wss = new WebSocketServer({ port });

  wss.on('listening', () =>
    console.log(
      t('server-started', {
        port: String(port),
        serverName: 'RS Battleship webSocket server',
        url: 'localhost',
      })
    )
  );

  wss.on('connection', (ws: WebSocket) => {
    id += 1;
    const clientId = id.toString();
    clients.set(clientId, ws);
    console.log(t('ws-client-connected', { clientId }));

    ws.on('message', (message: string) => {
      handleMessage({
        ws,
        message,
        clientId,
        clients,
      });
    });

    ws.on('close', () => {
      console.log(t('ws-client-disconnected', { clientId }));
      clients.delete(clientId);
    });
  });
}

export default start;
