export default interface IRoom {
  roomId: string;
  roomUsers: { name: string; index: string }[];
  gameStarted: boolean;
}
