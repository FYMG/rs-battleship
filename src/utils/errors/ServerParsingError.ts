import ServerError from './ServerError';
import { t } from '../loc';

export enum ExpectedType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  array = 'array',
  object = 'object',
  date = 'date',
  uuid = 'uuid',
  unexpected = 'unexpected',
}

export interface ServerParsingErrorArgs {
  field: string;
  expectedType: ExpectedType;
}

export default class ServerParsingError extends ServerError {
  field: string;

  expectedType: ExpectedType;

  constructor({ field, expectedType }: ServerParsingErrorArgs) {
    super(t('server-parse-error', { field, expectedType }));
    this.field = field;
    this.expectedType = expectedType;
    this.name = 'ServerParsingError';
  }
}
