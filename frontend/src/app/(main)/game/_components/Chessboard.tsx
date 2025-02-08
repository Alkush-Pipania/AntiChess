"use client";

import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";

interface ChessboardCompProps {
  positions: string;
  color: "white" | "black";
  socket: any;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
  moveHistory: string[];
  isMyTurn: boolean;
}

export default function ChessboardComp({
  positions,
  color,
  socket,
  onDrop,
  moveHistory,
  isMyTurn,
}: ChessboardCompProps) {
  const [boardWidth, setBoardWidth] = useState(480);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(480, window.innerWidth - 40);
      setBoardWidth(width);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex sm:flex-row flex-col sm:gap-x-5 justify-center items-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <div className="relative bg-white rounded-lg shadow-lg p-4 md:p-8">
        {!isMyTurn && (
          <div className="absolute inset-0 bg-black bg-opacity-10 z-10 flex items-center justify-center rounded-lg">
            <div className="text-black font-semibold">Waiting for opponent...</div>
          </div>
        )}
         <Chessboard
          id="ResponsiveChessboard"
          boardWidth={boardWidth}
          position={positions}
          onPieceDrop={(sourceSquare, targetSquare) => {
            return onDrop(sourceSquare, targetSquare);
          }}
          customDarkSquareStyle={{ backgroundColor: "#4a5568" }}
          customLightSquareStyle={{ backgroundColor: "#2d3748" }}
          boardOrientation={color}
          customPieces={{}}
           arePiecesDraggable={isMyTurn}
          // promotionToSquare={false}
         
          // showPromotionDialog={false}
          // promotionToQueen={false}  // This disables automatic promotion to queen
            // This disables the built-in promotion dialog
        />
      </div>

      
    </div>
  );
}

