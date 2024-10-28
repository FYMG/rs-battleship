import { WebSocket } from 'ws';

export default interface IUser {
  name: string;
  password: string;
  wins: number;
  clientId: string;
  ws: WebSocket | null;
}
