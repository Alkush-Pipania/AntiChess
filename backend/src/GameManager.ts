import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./Message";



export class GameManger{
  private game : Game[];
  private pendingUser : WebSocket | null;
  private users : WebSocket[];

  constructor(){
    this.game = [];
    this.pendingUser = null;
    this.users = [];
  }
  addUser(user : WebSocket){
    this.users.push(user);
    this.addHandler(user);
  }
  removeUser(user : WebSocket){
    this.users = this.users.filter(u => u !== user);
  }

  private addHandler(socket : WebSocket){
    socket.on('message', (data) =>{
      const message = JSON.parse(data.toString());
      if(message.type === INIT_GAME){
        if(this.pendingUser){
          const game = new Game(this.pendingUser, socket);
          this.game.push(game);
          this.pendingUser = null;
        }else{
          this.pendingUser = socket;
        }
      }

      if(message.type ===  MOVE){
        const game = this.game.find(g => g.player1 === socket || g.player2 === socket);
        if(game){
          game.makeMove(socket, message.move);
        }
      }

    })
  }



}
