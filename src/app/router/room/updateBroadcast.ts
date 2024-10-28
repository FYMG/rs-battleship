import IHandleDataParams from '../../../models/HandleDataParams';
import { getWaitingRoomList } from '../../../data';
import { wsTypes } from '../../../utils/consts';
import wsBroadcast from '../../../utils/helpers/wsBroadcast';

function updateRoomBroadcast({ clients }: IHandleDataParams) {
  const wsList = clients.values().toArray();
  const data = getWaitingRoomList();

  wsBroadcast(wsList, {
    type: wsTypes.updateRoom,
    data,
  });
}

export default updateRoomBroadcast;
