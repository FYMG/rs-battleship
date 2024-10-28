import { t } from '../loc';

export default class ServerDataNeedError extends Error {
  constructor() {
    super(t('server-data-not-provided'));
    this.name = 'ServerDataNeedError';
  }
}
