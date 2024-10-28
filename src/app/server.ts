import { WebSocketServer, WebSocket } from 'ws';
import * as console from 'node:console';
import { t } from '../utils/loc';
import DB from './db';
import handleMessage from './router';

export interface StartParams {
  port: number;
  db: DB;
}

function start({ port }: StartParams) {
  const clients = new Map<string, WebSocket>();
  let id = 0;

  const wss = new WebSocketServer({ port });

  wss.on('listening', () => console.log(t('server-started', { port: String(port) })));

  wss.on('connection', (ws: WebSocket) => {
    const clientId = (id += 1).toString();
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
