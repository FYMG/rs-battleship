import * as dotenv from 'dotenv';
import wsServer from './app/server';
import httpServer from './http/server';

dotenv.config();

const WS_PORT = parseInt(process.env.WS_PORT ?? '3000', 10);
const HTTP_PORT = parseInt(process.env.HTTP_PORT ?? '8081', 10);

httpServer({
  port: HTTP_PORT,
});

wsServer({
  port: WS_PORT,
});
