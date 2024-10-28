import wsBroadcast from '../../../utils/helpers/wsBroadcast';
import { wsTypes } from '../../../utils/consts';
import { clients, getWinnersList } from '../../../data';

function updateWinnersBroadcast() {
  const wsList = clients.values().toArray();

  wsBroadcast(wsList, {
    type: wsTypes.updateWinners,
    data: getWinnersList(),
  });
}

export default updateWinnersBroadcast;
