import ServerError from './ServerError';
import { t } from '../loc';

export default class ServerInvalidJSONFormatError extends ServerError {
  constructor() {
    super(t('server-invalid-json-format'));
    this.name = 'ServerInvalidJSONFormatError';
  }
}
