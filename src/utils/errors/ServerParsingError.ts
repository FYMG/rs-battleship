import ServerError from './ServerError';
import { t } from '../loc';

export interface ServerParsingErrorArgs {
  field: string;
  expectedType: string;
  gotValue: unknown;
}

export default class ServerParsingError extends ServerError {
  field: string;

  expectedType: string;

  gotValue: string;

  constructor({ field, expectedType, gotValue }: ServerParsingErrorArgs) {
    const gotValueString = String(gotValue);
    super(t('server-parse-error', { field, expectedType, gotValue: gotValueString }));
    this.field = field;
    this.gotValue = gotValueString;
    this.expectedType = expectedType;
    this.name = 'ServerParsingError';
  }
}
