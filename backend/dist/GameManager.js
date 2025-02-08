"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const Message_1 = require("./Message");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = new Map();
    }
    addUser(user) {
        console.log('User added');
        this.addHandler(user);
    }
    removeUser(user) {
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
    addHandler(socket) {
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === Message_1.INIT_GAME) {
                    if (this.pendingUser) {
                        const game = new Game_1.Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.users.set(this.pendingUser, game);
                        this.users.set(socket, game);
                        this.pendingUser = null;
                    }
                    else {
                        this.pendingUser = socket;
                    }
                }
                if (message.type === Message_1.MOVE) {
                    const game = this.users.get(socket);
                    if (game) {
                        game.makeMove(socket, message.move);
                    }
                }
            }
            catch (error) {
                console.error('Error handling message:', error);
            }
        });
    }
}
exports.GameManager = GameManager;
