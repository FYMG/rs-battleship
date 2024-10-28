import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { t } from '../utils/loc';

interface StartParams {
  port: number;
}

function start({ port }: StartParams) {
  const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path =
      __dirname + (req.url === '/' ? '/front/index.html' : `/front${req.url}`);
    fs.readFile(file_path, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
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
