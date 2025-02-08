"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Message_1 = require("./Message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moveCount = 0;
        this.gameActive = true;
        // Initialize with 10 minutes per player (600000 milliseconds)
        this.player1Time = 600000;
        this.player2Time = 600000;
        this.lastMoveTime = Date.now();
        this.timeoutInterval = null;
        // Start time updates
        this.startTimeUpdates();
        // Send initial game state
        this.player1.send(JSON.stringify({
            type: Message_1.INIT_GAME,
            payload: {
                color: 'white',
                timeLeft: this.player1Time,
                opponentTime: this.player2Time
            }
        }));
        this.player2.send(JSON.stringify({
            type: Message_1.INIT_GAME,
            payload: {
                color: 'black',
                timeLeft: this.player2Time,
                opponentTime: this.player1Time
            }
        }));
    }
    startTimeUpdates() {
        this.timeoutInterval = setInterval(() => {
            if (!this.gameActive) {
                if (this.timeoutInterval) {
                    clearInterval(this.timeoutInterval);
                }
                return;
            }
            const currentTime = Date.now();
            const timePassed = currentTime - this.lastMoveTime;
            if (this.moveCount % 2 === 0) {
                this.player1Time -= timePassed;
                if (this.player1Time <= 0) {
                    this.handleTimeout('black');
                }
            }
            else {
                this.player2Time -= timePassed;
                if (this.player2Time <= 0) {
                    this.handleTimeout('white');
                }
            }
            this.lastMoveTime = currentTime;
            // Send time updates to both players
            this.sendTimeUpdate();
        }, 1000); // Update every second
    }
    sendTimeUpdate() {
        if (this.player1Time <= 0 || this.player2Time <= 0)
            return;
        this.player1.send(JSON.stringify({
            type: 'time_update',
            payload: {
                timeLeft: this.player1Time,
                opponentTime: this.player2Time
            }
        }));
        this.player2.send(JSON.stringify({
            type: 'time_update',
            payload: {
                timeLeft: this.player2Time,
                opponentTime: this.player1Time
            }
        }));
    }
    handleTimeout(winner) {
        this.gameActive = false;
        if (this.timeoutInterval) {
            clearInterval(this.timeoutInterval);
        }
        const timeoutMessage = {
            type: Message_1.GAME_OVER,
            payload: {
                winner,
                reason: 'timeout'
            }
        };
        this.player1.send(JSON.stringify(timeoutMessage));
        this.player2.send(JSON.stringify(timeoutMessage));
    }
    makeMove(socket, move) {
        if (!this.gameActive)
            return;
        if (this.moveCount % 2 === 0 && socket !== this.player1)
            return;
        if (this.moveCount % 2 === 1 && socket !== this.player2)
            return;
        try {
            const result = this.board.move({
                from: move.from,
                to: move.to,
                promotion: move.promotion
            });
            if (!result)
                return;
            const increment = 5000;
            if (socket === this.player1) {
                this.player1Time += increment;
            }
            else {
                this.player2Time += increment;
            }
            this.lastMoveTime = Date.now();
            if (this.board.isGameOver()) {
                this.gameActive = false;
                if (this.timeoutInterval) {
                    clearInterval(this.timeoutInterval);
                }
                const gameOverMessage = {
                    type: Message_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === 'w' ? 'black' : 'white',
                        reason: 'checkmate'
                    }
                };
                this.player1.send(JSON.stringify(gameOverMessage));
                this.player2.send(JSON.stringify(gameOverMessage));
                return;
            }
            const movePayload = Object.assign(Object.assign({ from: move.from, to: move.to }, (move.promotion && { promotion: move.promotion })), { timeLeft: this.moveCount % 2 === 0 ? this.player2Time : this.player1Time, opponentTime: this.moveCount % 2 === 0 ? this.player1Time : this.player2Time });
            if (this.moveCount % 2 === 0) {
                this.player2.send(JSON.stringify({
                    type: Message_1.MOVE,
                    payload: movePayload
                }));
            }
            else {
                this.player1.send(JSON.stringify({
                    type: Message_1.MOVE,
                    payload: movePayload
                }));
            }
            this.moveCount++;
        }
        catch (e) {
            console.error(e);
        }
    }
    handleDisconnect(socket) {
        if (!this.gameActive)
            return;
        this.gameActive = false;
        if (this.timeoutInterval) {
            clearInterval(this.timeoutInterval);
        }
        const remainingPlayer = socket === this.player1 ? this.player2 : this.player1;
        remainingPlayer.send(JSON.stringify({
            type: Message_1.DISCONNECTED,
            payload: {
                message: 'Opponent disconnected'
            }
        }));
    }
}
exports.Game = Game;
