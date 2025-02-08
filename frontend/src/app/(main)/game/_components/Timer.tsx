import { useEffect, useState } from 'react';

interface TimerProps {
  time: number;
  isActive: boolean;
}

export default function Timer({ time, isActive }: TimerProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-2xl font-bold mb-4 ${
      isActive ? 'text-green-500' : 'text-gray-400'
    }`}>
      {formatTime(Math.max(0, time))}
    </div>
  );
}