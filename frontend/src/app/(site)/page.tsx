"use client";

import { useRouter } from "next/navigation";



export default function LandingPage() {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push("/game");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Anti-Chess!</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-xl text-center">
        Anti-Chess is a fun twist on traditional chess where the goal is to lose all your pieces!
        Learn the rules and strategies, then challenge others to see who can be the quickest loser.
      </p>
      <button 
        onClick={handlePlayClick} 
        className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Play Now
      </button>
    </div>
  );
}