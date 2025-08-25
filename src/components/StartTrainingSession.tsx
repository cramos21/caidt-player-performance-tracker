// src/components/StartTrainingSession.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { startTrainingCountdown } from "@/lib/startTraining";

type Props = {
  /** If false, button is disabled and shows a helper label */
  isConnected?: boolean;
};

export default function StartTrainingSession({ isConnected }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-400 grid place-items-center">
          <Activity className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            Start Live Training Session
          </h3>
          <p className="text-sm text-muted-foreground">
            Track speed, distance, and kicks in real time.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          size="lg"
          className="w-full"
          disabled={isConnected === false}
          onClick={() => startTrainingCountdown()} // <— opens the global overlay in Index.tsx
        >
          {isConnected === false ? "Connect tracker to start" : "Start"}
        </Button>
      </div>
    </div>
  );
}