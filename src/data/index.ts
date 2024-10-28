import IUser from '../models/IUser';
import IRoom from '../models/IRoom';

export const usersMap = new Map<string, IUser>();

export const getUsersList = () => Array.from(usersMap.values());
export const getUserByName = (name: string) =>
  Array.from(usersMap.values()).find((p) => p.name === name);
export const getUserByClientId = (clientId: string) =>
  Array.from(usersMap.values()).find((p) => p.clientId === clientId);
export const getWinnersList = () =>
  getUsersList()
    .sort((a, b) => b.wins - a.wins)
    .map((p) => ({ name: p.name, wins: p.wins }));

export const roomsMap = new Map<string, IRoom>();

export const createRoom = () => {
  const roomId = (roomsMap.size + 1).toString();
  const room = {
    roomId,
    roomUsers: [] as { name: string; index: string }[],
    gameStarted: false,
  };
  roomsMap.set(roomId, room);
  return room;
};
export const getWaitingRoomList = () =>
  Array.from(roomsMap.values())
    .filter((p) => !p.gameStarted)
    .map((p) => {
      return {
        roomId: p.roomId,
        roomUsers: p.roomUsers,
      };
    });
