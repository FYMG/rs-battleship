import wsBroadcast from '../../../utils/helpers/wsBroadcast';
import { wsTypes } from '../../../utils/consts';
import { getUsersList } from '../../../data';

function updateWinners() {
  const wsList = getUsersList()
    .map((p) => p.ws)
    .filter((w) => w !== null);
  const data = getUsersList()
    .sort((a, b) => b.wins - a.wins)
    .map((p) => ({ name: p.name, wins: p.wins }));

  wsBroadcast(wsList, {
    type: wsTypes.updateWinners,
    data,
  });
}

export default updateWinners;
