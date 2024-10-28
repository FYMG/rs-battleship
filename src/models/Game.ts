import * as console from 'node:console';
import * as crypto from 'node:crypto';
import IUser from './IUser';
import IRoom from './IRoom';
import wsSend from '../utils/helpers/wsSend';
import { wsTypes } from '../utils/consts';
import updateWinnersBroadcast from '../app/router/user/updateWinnersBroadcast';
import { increaseUserWins } from '../data';

export interface ICell {
  x: number;
  y: number;
}

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

    if (opponentDestroyedCells.some((cell) => cell.x === x && cell.y === y)) {
      return results;
    }

    opponentDestroyedCells.push({ x, y });
    let hit = false;

    for (const ship of opponentShips) {
      const shipCells = this.getShipCells(ship);

      if (shipCells.some((cell) => cell.x === x && cell.y === y)) {
        hit = true;
        const isKilled = shipCells.every((cell) =>
          opponentDestroyedCells.some(
            (destroyedCell) => destroyedCell.x === cell.x && destroyedCell.y === cell.y
          )
        );

        results.push({
          position: { x, y },
          currentPlayer: this.currentPlayerIndex,
          status: isKilled ? 'killed' : 'shot',
        });

        if (isKilled) {
          if (
            opponentShips.every((s) => this.isShipDestroyed(s, opponentDestroyedCells))
          ) {
            this.finish(playerIndex);
          } else {
            this.addSurroundingCells(ship, opponentDestroyedCells, results);
          }
        }
        break;
      }
    }

    if (!hit) {
      results.push({
        position: { x, y },
        currentPlayer: this.currentPlayerIndex,
        status: 'miss',
      });
      this.switchPlayer();
      if (this.currentPlayerIndex === '-1') {
        results = [...results, ...this.botMove()];
      }
    }

    return results;
  }

  private getShipCells(ship: IShip): ICell[] {
    const cells: ICell[] = [];
    for (let i = 0; i < ship.length; i += 1) {
      cells.push({
        x: ship.direction ? ship.position.x : ship.position.x + i,
        y: ship.direction ? ship.position.y + i : ship.position.y,
      });
    }
    return cells;
  }

  private isShipDestroyed(ship: IShip, destroyedCells: ICell[]): boolean {
    return this.getShipCells(ship).every((cell) =>
      destroyedCells.some(
        (destroyedCell) => destroyedCell.x === cell.x && destroyedCell.y === cell.y
      )
    );
  }

  private addSurroundingCells(
    ship: IShip,
    destroyedCells: ICell[],
    results: IAttackResult[]
  ): void {
    const surroundingCells = this.getSurroundingCells(ship);
    for (const cell of surroundingCells) {
      if (
        !destroyedCells.some(
          (destroyedCell) => destroyedCell.x === cell.x && destroyedCell.y === cell.y
        )
      ) {
        destroyedCells.push(cell);
        results.push({
          position: cell,
          currentPlayer: this.currentPlayerIndex,
          status: 'miss',
        });
      }
    }
  }

  private switchPlayer(): void {
    this.currentPlayerIndex =
      this.currentPlayerIndex === this.player1.index
        ? this.player2.index
        : this.player1.index;
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

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
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
      const x = crypto.randomInt(1, 11);
      const y = crypto.randomInt(1, 11);
      result.push(...this.attack('-1', x, y));
    }

    console.log('Bot move: ', result);

    return result;
  }
}
