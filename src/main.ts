import * as dotenv from 'dotenv';
import wsServer from './app/server';
import httpServer from './http/server';
import DB from './app/db';

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT ?? '3000', 10);
const HTTP_PORT = parseInt(process.env.HTTP_PORT ?? '8081', 10);

const db = new DB();

httpServer({
  port: HTTP_PORT,
});

wsServer({
  port: WS_PORT,
  db,
});
