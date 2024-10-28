import IUser from './IUser';
import IRoom from './IRoom';

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

interface IGameUser extends IUser {
  index: string;
}

export default class Game {
  id: string;

  room: IRoom;

  player1: IGameUser;

  player2: IGameUser;

  player1Ships?: IShip[];

  player2Ships?: IShip[];

  gameStarted = false;

  constructor({
    player1,
    player2,
    room,
  }: {
    player1: IGameUser;
    player2: IGameUser;
    room: IRoom;
  }) {
    this.id = room.roomId;
    this.room = room;
    this.player1 = player1;
    this.player2 = player2;
  }

  addShips(playerIndex: string, ships: IShip[]) {
    if (playerIndex === this.player1.index) {
      this.player1Ships = ships;
    }
    if (playerIndex === this.player2.index) {
      this.player2Ships = ships;
    }

    if (this.player1Ships && this.player2Ships) {
      this.gameStarted = true;
    }
  }
}
