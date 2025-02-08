import React from 'react';
import { Trophy, XCircle, RotateCcw } from 'lucide-react';

interface GameOverProps {
  isWinner: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ isWinner }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-[slideIn_0.5s_ease-out]"
        style={{
          animation: 'slideIn 0.5s ease-out'
        }}
      >
        <div className="text-center">
          {isWinner ? (
            <div className="animate-[bounce_1s_ease-in-out_infinite]">
              <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
            </div>
          ) : (
            <div className="animate-[shake_0.5s_ease-in-out]">
              <XCircle className="w-20 h-20 mx-auto text-red-500" />
            </div>
          )}
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900 animate-[fadeIn_0.8s_ease-out]">
            {isWinner ? 'Congratulations!' : 'Game Over'}
          </h2>
          
          <p className="mt-2 text-lg text-gray-600 animate-[fadeIn_1s_ease-out]">
            {isWinner 
              ? 'You have won the game! Well played!' 
              : 'Better luck next time!'}
          </p>
          
          <button
            // onClick={onNewGame}
            className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;