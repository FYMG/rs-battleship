import IHandleDataParams from '../../../models/HandleDataParams';
import { getWaitingRoomList } from '../../../data';
import { wsTypes } from '../../../utils/consts';
import wsSend from '../../../utils/helpers/wsSend';

function updateRoom({ ws }: IHandleDataParams) {
  const data = getWaitingRoomList();

  wsSend(ws, {
    type: wsTypes.updateRoom,
    data,
  });
}

export default updateRoom;
