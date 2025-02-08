import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./Message";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: Map<WebSocket, Game>;

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = new Map();
  }

  addUser(user: WebSocket) {
    console.log('User added');
    this.addHandler(user);
  }

  removeUser(user: WebSocket) {
    console.log('User removed');
    const game = this.users.get(user);
    if (game) {
      game.handleDisconnect(user);
      this.games = this.games.filter(g => g !== game);
    }
    if (this.pendingUser === user) {
      this.pendingUser = null;
    }
    this.users.delete(user);
  }

  private addHandler(socket: WebSocket) {
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === INIT_GAME) {
          if (this.pendingUser) {
            const game = new Game(this.pendingUser, socket);
            this.games.push(game);
            this.users.set(this.pendingUser, game);
            this.users.set(socket, game);
            this.pendingUser = null;
          } else {
            this.pendingUser = socket;
          }
        }

        if (message.type === MOVE) {
          const game = this.users.get(socket);
          if (game) {
            game.makeMove(socket, message.move);
          }
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  }
}
