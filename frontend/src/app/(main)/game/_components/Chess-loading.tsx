import { CircleIcon, Crown, Swords } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function ChessLoading() {
  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
  //   }, 800);

  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="relative flex justify-center">
          <div className="absolute animate-ping">
            <Crown className="w-16 h-16 text-primary/30" />
          </div>
          <Crown className="w-16 h-16 text-primary" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Finding Your Opponent</h2>
            <p className="text-sm text-muted-foreground">
              You're in queue. We're matching you with a worthy opponent.
            </p>
          </div>

          {/* <Progress value={progress} className="h-2" /> */}
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <CircleIcon className="h-2 w-2 fill-current" />
            <CircleIcon className="h-2 w-2 fill-current" />
            <CircleIcon className="h-2 w-2 fill-current" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Average wait time: ~30 seconds</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
