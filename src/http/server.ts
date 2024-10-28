import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { t } from '../utils/loc';

interface StartParams {
  port: number;
}

function start({ port }: StartParams) {
  const httpServer = http.createServer((req, res) => {
    const dirName = path.resolve();
    const filePath = path.join(
      dirName,
      'front',
      req.url! === '/' ? 'index.html' : req.url!
    );

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'File not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });

  httpServer.on('listening', () => {
    console.log(
      t('server-started', {
        port: String(port),
        serverName: 'RS Battleship static server',
        url: 'http://localhost',
      })
    );
  });

  httpServer.listen(port);
}

export default start;
