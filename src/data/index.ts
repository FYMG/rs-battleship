import { WebSocket } from 'ws';
import IUser from '../models/IUser';
import IRoom from '../models/IRoom';
import Game from '../models/Game';

export const usersMap = new Map<string, IUser>();

export const getUsersList = () => Array.from(usersMap.values());
export const increaseUserWins = (name: string) => {
  const user = getUserByName(name);
  if (user) {
    user.wins += 1;
  }
};
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
export const getRoomById = (id: string) => roomsMap.get(id);
export const getWaitingRoomList = () =>
  Array.from(roomsMap.values())
    .filter((p) => !p.gameStarted)
    .map((p) => {
      return {
        roomId: p.roomId,
        roomUsers: p.roomUsers,
      };
    });

export const gamesMap = new Map<string, Game>();

export const clients = new Map<string, WebSocket>();
