import { wsTypes } from '../../../utils/consts';
import { getWinnersList } from '../../../data';
import IHandleDataParams from '../../../models/HandleDataParams';
import wsSend from '../../../utils/helpers/wsSend';

function updateWinners({ ws }: IHandleDataParams) {
  wsSend(ws, {
    type: wsTypes.updateWinners,
    data: getWinnersList(),
  });
}

export default updateWinners;
