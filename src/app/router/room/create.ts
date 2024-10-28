import IHandleDataParams from '../../../models/HandleDataParams';
import { createRoom, getUserByClientId } from '../../../data';
import wsSend from '../../../utils/helpers/wsSend';
import { wsTypes } from '../../../utils/consts';
import updateRoomBroadcast from './updateBroadcast';

function handleCreateRoom(params: IHandleDataParams) {
  const { ws, clientId } = params;
  const user = getUserByClientId(clientId);
  if (!user) {
    wsSend(ws, {
      type: wsTypes.createRoom,
      error: true,
      errorText: 'User not found',
    });
    return;
  }
  const room = createRoom();

  room.roomUsers.push({
    name: user.name,
    index: user.clientId,
  });

  updateRoomBroadcast(params);
}

export default handleCreateRoom;
