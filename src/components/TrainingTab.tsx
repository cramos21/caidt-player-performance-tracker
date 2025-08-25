// src/components/TrainingTab.tsx
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Target, Timer, Gauge } from "lucide-react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { toast } from "sonner";

type Props = {
  onStartTraining: () => void;
  isConnected: boolean; // from Index (kept for compatibility)
  onTrainingTypeSelect: (type: "free-play" | "skill-training" | "endurance" | "performance") => void;
};

const TrainingTab: React.FC<Props> = ({ onStartTraining, isConnected, onTrainingTypeSelect }) => {
  // Also read BLE state from context (works even if parent prop lags a tick)
  const { isConnected: bleConnected, connectQuick } = useBluetooth();
  const connected = isConnected || bleConnected;

  const [isBusy, setIsBusy] = useState(false);

  const handleConnectClick = async () => {
    if (connected) {
      // Already connected — just notify global listeners so UI can update
      try { window.dispatchEvent(new CustomEvent("tracker-connected")); } catch {}
      return;
    }
    try {
      setIsBusy(true);
      await connectQuick();
      // The Bluetooth provider dispatches 'tracker-connected'; Index shows the toast.
    } catch (e: any) {
      toast.error(
        typeof e?.message === "string" ? e.message : "Couldn’t connect. Make sure the tracker is advertising."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handlePrimary = () => {
    if (connected) onStartTraining();
    else void handleConnectClick();
  };

  const trainingTypes = useMemo(
    () => [
      {
        key: "free-play" as const,
        title: "Free Play",
        desc: "Practice freely and track your movements",
        Icon: Activity,
      },
      {
        key: "skill-training" as const,
        title: "Skill Training",
        desc: "Focused drills to improve technique",
        Icon: Target,
      },
      {
        key: "endurance" as const,
        title: "Endurance Run",
        desc: "Build stamina with distance goals",
        Icon: Timer,
      },
      {
        key: "performance" as const,
        title: "Performance Test",
        desc: "Test your speed and acceleration",
        Icon: Gauge,
      },
    ],
    []
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Title + subtitle — add extra top margin so it matches other tabs */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-foreground">Training</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your tracker first to start training
        </p>
      </div>

      {/* Quick Start */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Quick Start</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {connected ? "Tracker connected — you're good to go." : "Connect your tracker first to start training"}
          </p>

          <Button
            onClick={handlePrimary}
            disabled={isBusy}
            className="w-full h-12 text-base font-semibold"
          >
            {connected ? "Start Training" : isBusy ? "Connecting…" : "Connect Tracker"}
          </Button>
        </CardContent>
      </Card>

      {/* Training Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Training Types</h3>

        {trainingTypes.map(({ key, title, desc, Icon }) => (
          <Card key={key} className="bg-white/5 border-white/10">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <Icon className="w-6 h-6 opacity-90" />
                </div>
                <div>
                  <div className="text-xl font-semibold">{title}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </div>

              <Button variant="ghost" className="text-primary" onClick={() => onTrainingTypeSelect(key)}>
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingTab;