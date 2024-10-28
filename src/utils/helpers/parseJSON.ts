import ServerInvalidJSONFormatError from '../errors/ServerInvalidJSONFormatError';
import ServerDataNeedError from '../errors/ServerDataNeedError';

function parseRequest<T>(data: string): T {
  try {
    return JSON.parse(data);
  } catch (error: unknown) {
    if (!data) {
      throw new ServerDataNeedError();
    }
    throw new ServerInvalidJSONFormatError();
  }
}

export default parseRequest;
