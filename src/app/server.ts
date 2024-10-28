import * as console from 'node:console';
import { t } from '../utils/loc';
import DB from './db';

export interface StartParams {
  port: number;
  db: DB;
}

function start({ port, db }: StartParams) {
  console.log(db);
  console.log(t('server-started', { port: String(port) }));
}

export default start;
