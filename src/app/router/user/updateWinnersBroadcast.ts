import wsBroadcast from '../../../utils/helpers/wsBroadcast';
import { wsTypes } from '../../../utils/consts';
import { getWinnersList } from '../../../data';
import IHandleDataParams from '../../../models/HandleDataParams';

function updateWinnersBroadcast({ clients }: IHandleDataParams) {
  const wsList = clients.values().toArray();

  wsBroadcast(wsList, {
    type: wsTypes.updateWinners,
    data: getWinnersList(),
  });
}

export default updateWinnersBroadcast;
