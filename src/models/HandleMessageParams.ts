import { WebSocket } from 'ws';

export default interface IHandleMessageParams {
  ws: WebSocket;
  message: string;
  clientId: string;
  clients: Map<string, WebSocket>;
}
