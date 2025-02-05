import { WebSocketServer } from 'ws';
import { GameManger } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManger = new GameManger();

wss.on('connection', function connection(ws) {
  gameManger.addUser(ws)
  ws.on('disconnect', () => gameManger.removeUser(ws));
});