"use client";

import ChessboardComp from "./_components/Chessboard";
import { useEffect, useRef, useState } from "react";
import { DISCONNECTED, GAME_OVER, INIT_GAME, MOVE } from "@/lib/Message";
import { Chess, Square } from "chess.js";
import { ChessLoading } from "./_components/Chess-loading";
import GameOver from "./_components/GameOver";
import DisconnectNotification from "./_components/Disconnect";
import Timer from "./_components/Timer";
import PromotionDialog from "./_components/PromotionDialog";

export default function Game() {
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [game] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState<"white" | "black">("white");
  const [gameOver, setGameOver] = useState(false);
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  // for time
  const [myTime, setMyTime] = useState<number>(600000);
  const [opponentTime, setOpponentTime] = useState<number>(600000);
  const [promotionSquare, setPromotionSquare] = useState<Square | null>(null);
  const [pendingMove, setPendingMove] = useState<{from: string, to: string} | null>(null);

  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen = () => {
      socket.current?.send(JSON.stringify({ type: INIT_GAME }));
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setColor(message.payload.color);
          setIsMyTurn(message.payload.color === "white"); // White moves first
          setStarted(true);
          setMyTime(message.payload.timeLeft);
          setOpponentTime(message.payload.opponentTime);
          break;

        case MOVE:
          console.log(message.payload.from, message.payload.to);
          ReciveMoveHandler(message.payload.from, message.payload.to);
          setIsMyTurn(true); // After receiving opponent's move, it's our turn
          break;
        case "time_update":
          setMyTime(message.payload.timeLeft);
          setOpponentTime(message.payload.opponentTime);
          break;
        case GAME_OVER:
          setGameOver(true);
          setIsMyTurn(false);
          break;

        case DISCONNECTED:
          setDisconnected(true);
          setIsMyTurn(false);
          break;

        default:
          console.log("Unknown message type:");
      }
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  function ReciveMoveHandler(sourceSquare: string, targetSquare: string) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) {
      console.log("Invalid move:", sourceSquare, "to", targetSquare);
      return false;
    }

    setPosition(game.fen());
    setMoveHistory((prevMoves) => [...prevMoves, `${sourceSquare} to ${targetSquare}`]);

    if (game.isGameOver()) {
      console.log("Game over:", game.isCheckmate() ? "Checkmate" : "Stalemate");
    } else if (game.inCheck()) {
      console.log("Check!");
    }
  }

  function SendMoveHandler(sourceSquare: string, targetSquare: string) {
    // Don't allow moves if it's not player's turn or game is over
    if (!isMyTurn || gameOver || disconnected) {
      return false;
    }

    try {
      // Check if the piece being moved belongs to the player
      const piece = game.get(sourceSquare); // type error
      if (!piece || (color === "white" && piece.color !== "w") ||
        (color === "black" && piece.color !== "b")) {
        return false;
      }

      const isPawnPromotion = 
        piece.type === 'p' && 
        ((piece.color === 'w' && targetSquare[1] === '8') || 
         (piece.color === 'b' && targetSquare[1] === '1'));

      if (isPawnPromotion) {
        setPromotionSquare(targetSquare as Square);
        setPendingMove({ from: sourceSquare, to: targetSquare });
        return true; // Return true to allow the move visually
      }

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        console.log("Invalid move:", sourceSquare, "to", targetSquare);
        return false;
      }

      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            type: MOVE,
            move: { from: sourceSquare, to: targetSquare },
          })
        );
      } else {
        console.log("WebSocket is not open. Ready state: ", socket.current?.readyState);
        return false;
      }

      setPosition(game.fen());
      setMoveHistory((prevMoves) => [...prevMoves, `${sourceSquare} to ${targetSquare}`]);
      setIsMyTurn(false); // Set turn to false after making a move

      if (game.isGameOver()) {
        console.log("Game over:", game.isCheckmate() ? "Checkmate" : "Stalemate");
      } else if (game.inCheck()) {
        console.log("Check!");
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  function handlePromotion(promotionPiece: 'q' | 'r' | 'b' | 'n') {
    if (!pendingMove || !promotionSquare) return;

    try {
      const move = game.move({
        from: pendingMove.from,
        to: pendingMove.to,
        promotion: promotionPiece
      });

      if (move && socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            type: MOVE,
            move: { 
              from: pendingMove.from, 
              to: pendingMove.to,
              promotion: promotionPiece 
            }
          })
        );

        setPosition(game.fen());
        setMoveHistory((prevMoves) => [
          ...prevMoves, 
          `${pendingMove.from} to ${pendingMove.to} (=${promotionPiece.toUpperCase()})`
        ]);
        setIsMyTurn(false);
      }
    } catch (e) {
      console.error('Promotion error:', e);
    }

    // Reset promotion state
    setPromotionSquare(null);
    setPendingMove(null);
  }



  if (!started) return <ChessLoading />;

  return (
    <div className="text-white">
      {gameOver && <GameOver isWinner={false} />}
      {disconnected && <DisconnectNotification />}
      {promotionSquare && (
        <PromotionDialog
          onSelect={handlePromotion}
          onClose={() => {
            setPromotionSquare(null);
            setPendingMove(null);
            // Reset the piece position
            setPosition(game.fen());
          }}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <ChessboardComp
        positions={position}
        color={color}
        socket={socket}
        onDrop={SendMoveHandler}
        moveHistory={moveHistory}
        isMyTurn={isMyTurn}
      />
      <div className="mt-8 bg-gray-800 rounded-lg p-4 max-w-md sm:h-screen w-full">
        <Timer time={myTime} isActive={isMyTurn && !gameOver && !disconnected} />
        <h2 className="text-xl font-semibold text-white mb-2">Move History</h2>
        <div className="text-gray-300 mb-4">
          {isMyTurn ? "Your turn" : "Opponent's turn"}
        </div>
        <ul className="text-gray-300 space-y-1">
          {moveHistory.length === 0 ? (
            <li>No moves yet</li>
          ) : (
            moveHistory.map((move: string, index: number) => (
              <li key={index}>{`${index + 1}. ${move}`}</li>
            ))
          )}
        </ul>
      </div>
      </div>
      
      
    </div>
  );
}
