import ServerError from './ServerError';
import { t } from '../loc';

export default class ServerEndpointNotFoundError extends ServerError {
  constructor() {
    super(t('server-endpoint-not-found'));
    this.name = 'ServerEndpointNotFoundError';
  }
}
