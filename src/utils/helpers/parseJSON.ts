import ServerInvalidJSONFormatError from '../errors/ServerInvalidJSONFormatError';

function parseRequest<T = Record<PropertyKey, any>>(data: string): T {
  try {
    return JSON.parse(data);
  } catch {
    if (!data) {
      return {} as T;
    }
    throw new ServerInvalidJSONFormatError();
  }
}

export default parseRequest;
