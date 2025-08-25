// src/components/SessionComplete.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Zap, MapPin, Target, Clock } from "lucide-react";

type Summary = {
  distanceKm: number;
  kicks: number;
  maxSpeed: number;    // km/h
  durationSec: number; // seconds
};

type Props = {
  summary: Summary;
  onClose: () => void;
};

const fmtTime = (secs: number) => {
  const s = Math.max(0, Math.floor(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function SessionComplete({ summary, onClose }: Props) {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Small top padding so title isn't jammed into the notch */}
      <div className="flex-1 overflow-y-auto px-4 w-full max-w-sm mx-auto pt-6">
        {/* Simple confetti + check animation styles */}
        <style>{`
          @keyframes pop-in {
            0% { transform: scale(0.7); opacity: 0 }
            60% { transform: scale(1.05); opacity: 1 }
            100% { transform: scale(1); opacity: 1 }
          }
          @keyframes float-up {
            0% { transform: translateY(0) rotate(0deg); opacity: 1 }
            100% { transform: translateY(-120px) rotate(180deg); opacity: 0 }
          }
          .confetti > span {
            position: absolute;
            width: 6px; height: 10px; border-radius: 2px;
            animation: float-up 1.2s ease-out forwards;
          }
        `}</style>

        {/* Celebration header */}
        <div className="relative mt-2 mb-6">
          {/* Confetti bits */}
          <div className="confetti pointer-events-none">
            <span style={{ left: "8%",  bottom: "-6px",  background: "#22c55e", animationDelay: "0s"   }} />
            <span style={{ left: "24%", bottom: "-10px", background: "#60a5fa", animationDelay: "0.1s"}} />
            <span style={{ left: "42%", bottom: "-14px", background: "#f97316", animationDelay: "0.2s"}} />
            <span style={{ left: "58%", bottom: "-12px", background: "#a78bfa", animationDelay: "0.1s"}} />
            <span style={{ left: "76%", bottom: "-8px",  background: "#ef4444", animationDelay: "0.05s"}} />
            <span style={{ left: "88%", bottom: "-10px", background: "#22c55e", animationDelay: "0.15s"}} />
          </div>

          {/* Trophy + title */}
          <div className="flex flex-col items-center" style={{ animation: "pop-in .5s ease-out" }}>
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-3">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">Session Complete!</h2>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Nice work — your training is saved.
            </p>
          </div>
        </div>

        {/* Summary card */}
        <Card className="bg-white/5 border-white/10 p-4 space-y-4">
          <Row
            icon={<Zap className="w-4 h-4" />}
            label="Fastest Speed"
            value={`${(summary.maxSpeed ?? 0).toFixed(1)} km/h`}
          />
          <Row
            icon={<MapPin className="w-4 h-4" />}
            label="Distance"
            value={`${(summary.distanceKm ?? 0).toFixed(2)} km`}
          />
          <Row
            icon={<Target className="w-4 h-4" />}
            label="Kicks"
            value={`${summary.kicks ?? 0}`}
          />
          <Row
            icon={<Clock className="w-4 h-4" />}
            label="Time"
            value={fmtTime(summary.durationSec ?? 0)}
          />
        </Card>

        {/* Action */}
        <Button className="w-full h-12 text-base font-semibold mt-6" onClick={onClose}>
          Done
        </Button>
      </div>

      {/* Bottom safe area */}
      <div
        className="w-full"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      />
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-lg font-bold text-foreground tabular-nums">{value}</div>
    </div>
  );
}