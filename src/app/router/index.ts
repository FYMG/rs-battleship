import { WebSocket } from 'ws';
import { t } from '../../utils/loc';

export interface HandleMessageParams {
  ws: WebSocket;
  message: string;
  clientId: string;
  clients: Map<string, WebSocket>;
}

function handleMessage({ ws, message, clientId }: HandleMessageParams) {
  console.log(t('ws-client-message', { clientId, message }));
  ws.send('Hello from server');
}

export default handleMessage;
