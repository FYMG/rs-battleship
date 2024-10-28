import * as console from 'node:console';
import IUser from './IUser';
import IRoom from './IRoom';
import wsSend from '../utils/helpers/wsSend';
import { wsTypes } from '../utils/consts';
import updateWinnersBroadcast from '../app/router/user/updateWinnersBroadcast';
import { increaseUserWins } from '../data';

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface IAttackResult {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: string;
  status: 'miss' | 'killed' | 'shot';
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

  player1DestroyedCells: { x: number; y: number }[] = [];

  player2Ships?: IShip[];

  player2DestroyedCells: { x: number; y: number }[] = [];

  currentPlayerIndex: string;

  gameStarted = false;

  singlePlayer = false;

  constructor({
    player1,
    player2,
    room,
    singlePlayer = false,
  }: {
    player1: IGameUser;
    player2: IGameUser;
    room: IRoom;
    singlePlayer?: boolean;
  }) {
    this.singlePlayer = singlePlayer;
    this.id = room.roomId;
    this.room = room;
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayerIndex =
      player1.index > player2.index ? player1.index : player2.index;
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
      if (this.player1.ws) {
        wsSend(this.player1.ws, {
          type: wsTypes.startGame,
          data: {
            currentPlayerIndex: this.currentPlayerIndex,
            ships: this.player1Ships,
          },
        });
      }
      if (this.player2.ws) {
        wsSend(this.player2.ws, {
          type: wsTypes.startGame,
          data: {
            currentPlayerIndex: this.currentPlayerIndex,
            ships: this.player2Ships,
          },
        });
      }
    }
  }

  finish(winIndex: string) {
    if (winIndex === this.player1.index) {
      increaseUserWins(this.player2.name);
    }
    if (winIndex === this.player2.index) {
      increaseUserWins(this.player1.name);
    }
    if (this.player1.ws) {
      wsSend(this.player1.ws, {
        type: wsTypes.finish,
        data: {
          winPlayer: winIndex,
        },
      });
    }
    if (this.player2.ws) {
      wsSend(this.player2.ws, {
        type: wsTypes.finish,
        data: {
          winPlayer: winIndex,
        },
      });
    }

    updateWinnersBroadcast();
  }

  attack(playerIndex: string, x: number, y: number): IAttackResult[] {
    const opponentShips =
      playerIndex === this.player1.index ? this.player2Ships : this.player1Ships;
    const opponentDestroyedCells =
      playerIndex === this.player1.index
        ? this.player2DestroyedCells
        : this.player1DestroyedCells;
    let results: IAttackResult[] = [];

    if (!opponentShips) {
      throw new Error('Opponent ships not found');
    }

    let hit = false;
    if (!opponentDestroyedCells.some((cell) => cell.x === x && cell.y === y)) {
      opponentDestroyedCells.push({ x, y });
      for (const ship of opponentShips) {
        for (let i = 0; i < ship.length; i++) {
          const shipX = !ship.direction ? ship.position.x + i : ship.position.x;
          const shipY = !ship.direction ? ship.position.y : ship.position.y + i;

          if (shipX === x && shipY === y) {
            hit = true;

            const isKilled =
              opponentDestroyedCells.filter((cell) => {
                for (let j = 0; j < ship.length; j++) {
                  const sx = !ship.direction ? ship.position.x + j : ship.position.x;
                  const sy = !ship.direction ? ship.position.y : ship.position.y + j;
                  if (cell.x === sx && cell.y === sy) {
                    return true;
                  }
                }
                return false;
              }).length === ship.length;

            results.push({
              position: { x, y },
              currentPlayer: this.currentPlayerIndex,
              status: isKilled ? 'killed' : 'shot',
            });

            if (isKilled) {
              const allShipsDestroyed = opponentShips.every(
                (ship) =>
                  ship.length ===
                  opponentDestroyedCells.filter((cell) => {
                    for (let j = 0; j < ship.length; j++) {
                      const sx = !ship.direction ? ship.position.x + j : ship.position.x;
                      const sy = !ship.direction ? ship.position.y : ship.position.y + j;
                      if (cell.x === sx && cell.y === sy) {
                        return true;
                      }
                    }
                    return false;
                  }).length
              );

              if (allShipsDestroyed) {
                this.finish(playerIndex);
              } else {
                const surroundingCells = this.getSurroundingCells(ship);
                for (const cell of surroundingCells) {
                  if (
                    !opponentDestroyedCells.some(
                      (destroyedCell) =>
                        destroyedCell.x === cell.x && destroyedCell.y === cell.y
                    )
                  ) {
                    opponentDestroyedCells.push(cell);
                    results.push({
                      position: cell,
                      currentPlayer: this.currentPlayerIndex,
                      status: 'miss',
                    });
                  }
                }
              }
            }
            break;
          }
        }
        if (hit) break;
      }
    } else {
      return results;
    }

    if (!hit) {
      results.push({
        position: { x, y },
        currentPlayer: this.currentPlayerIndex,
        status: 'miss',
      });
      this.currentPlayerIndex =
        this.currentPlayerIndex === this.player1.index
          ? this.player2.index
          : this.player1.index;

      if (this.currentPlayerIndex === '-1') {
        results = [...results, ...this.botMove()];
      }
    }

    return results;
  }

  turn() {
    return this.currentPlayerIndex;
  }

  private getSurroundingCells(ship: IShip): { x: number; y: number }[] {
    const cells: { x: number; y: number }[] = [];
    const startX = ship.position.x - 1;
    const startY = ship.position.y - 1;
    const endX = !ship.direction ? ship.position.x + ship.length : ship.position.x + 1;
    const endY = !ship.direction ? ship.position.y + 1 : ship.position.y + ship.length;

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        if (x >= 0 && x < 10 && y >= 0 && y < 10) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  botMove() {
    const result: IAttackResult[] = [];

    while (this.currentPlayerIndex === '-1') {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      result.push(...this.attack('-1', x, y));
    }

    console.log('Bot move: ', result);

    return result;
  }
}
