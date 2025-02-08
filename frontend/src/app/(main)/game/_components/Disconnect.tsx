import React from 'react';
import { WifiOff, AlertCircle, PlayCircle } from 'lucide-react';



const DisconnectNotification = () => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-[slideIn_0.5s_ease-out]"
      >
        <div className="text-center">
          <div className="relative">
            <WifiOff className="w-16 h-16 mx-auto text-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
            <AlertCircle className="w-8 h-8 text-amber-500 absolute top-0 right-1/3 animate-[bounce_1s_ease-in-out_infinite]" />
          </div>
          
          <h2 className="mt-6 text-2xl font-bold text-gray-900 animate-[fadeIn_0.8s_ease-out]">
            Opponent Disconnected
          </h2>
          
          <p className="mt-4 text-gray-600 animate-[fadeIn_1s_ease-out]">
            Your opponent has lost connection to the game. The match cannot continue.
          </p>
          
          <div className="mt-8 space-y-4">
            <button
              // onClick={onNewMatch}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Find New Match
            </button>
            
            <p className="text-sm text-gray-500 animate-[fadeIn_1.2s_ease-out]">
              You'll be matched with a new opponent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisconnectNotification;