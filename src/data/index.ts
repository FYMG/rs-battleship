import IUser from '../models/IUser';

export const usersMap = new Map<string, IUser>();

export const getUsersList = () => Array.from(usersMap.values());
export const getUserByName = (name: string) =>
  Array.from(usersMap.values()).find((p) => p.name === name);
