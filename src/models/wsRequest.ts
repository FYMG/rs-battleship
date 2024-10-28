import { wsTypes } from '../utils/consts';

interface IWsRequest {
  type: (typeof wsTypes)[keyof typeof wsTypes];
  data: Record<PropertyKey, unknown>;
  id: number;
}

const wsRequestSchema = {
  type: 'string',
  data: {},
  id: 'number',
};

export { wsRequestSchema, IWsRequest };
