import { IWsRequest } from './wsRequest';
import IHandleMessageParams from './HandleMessageParams';

export default interface IHandleDataParams extends IHandleMessageParams {
  data: IWsRequest;
}
