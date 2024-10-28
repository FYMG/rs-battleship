import ServerParsingError from '../errors/ServerParsingError';

function validateObject(schema: any, obj: any, path: string = ''): void {
  const schemaKeys = Object.keys(schema);
  const objKeys = Object.keys(obj);

  for (const key of objKeys) {
    if (schemaKeys.length === 0) {
      break;
    }
    if (!schemaKeys.includes(key)) {
      throw new ServerParsingError({
        field: path ? `${path}.${key}` : key,
        expectedType: 'key in schema',
        gotValue: 'unexpected key',
      });
    }
  }

  for (const key of schemaKeys) {
    const type = schema[key];
    const value = obj[key];
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof type === 'string') {
      if (typeof value !== type) {
        throw new ServerParsingError({
          field: currentPath,
          expectedType: type,
          gotValue: typeof value,
        });
      }
    } else if (Array.isArray(type)) {
      if (!Array.isArray(value)) {
        throw new ServerParsingError({
          field: currentPath,
          expectedType: 'array',
          gotValue: typeof value,
        });
      }
      for (let i = 0; i < value.length; i++) {
        validateObject(type[0], value[i], `${currentPath}[${i}]`);
      }
    } else if (typeof type === 'object') {
      if (typeof value !== 'object' || value === null) {
        throw new ServerParsingError({
          field: currentPath,
          expectedType: 'object',
          gotValue: typeof value,
        });
      }
      validateObject(type, value, currentPath);
    }
  }
}

export default validateObject;
