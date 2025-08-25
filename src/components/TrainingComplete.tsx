// src/components/TrainingComplete.tsx
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

type Summary = {
  distanceKm: number;
  kicks: number;
  maxSpeed: number;   // km/h
  durationSec: number;
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

export default function TrainingComplete({ summary, onClose }: Props) {
  // lightweight confetti positions
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2 + Math.random() * 1.5,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        color: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7"][
          i % 5
        ],
      })),
    []
  );

  return (
    <div className="relative flex min-h-full w-full items-center justify-center px-4">
      {/* Confetti */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {bits.map((b, i) => (
          <span
            key={i}
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              width: b.size,
              height: b.size * 0.4,
              transform: `rotate(${b.rotate}deg)`,
              background: b.color,
            }}
            className="absolute top-[-10px] rounded-[2px] opacity-0 confetti-chip"
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 ring-8 ring-green-500/10">
          <Trophy className="h-8 w-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">
          Session complete!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nice work—your stats have been saved.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-muted-foreground">Distance</div>
            <div className="mt-1 text-lg font-bold tabular-nums">
              {summary.distanceKm.toFixed(2)}<span className="text-xs"> km</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-muted-foreground">Kicks</div>
            <div className="mt-1 text-lg font-bold tabular-nums">
              {summary.kicks}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="text-xs text-muted-foreground">Fastest</div>
            <div className="mt-1 text-lg font-bold tabular-nums">
              {summary.maxSpeed.toFixed(1)}
              <span className="text-xs"> km/h</span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/10 p-3">
          <div className="text-xs text-muted-foreground">Time</div>
          <div className="mt-1 text-lg font-bold tabular-nums">
            {fmtTime(summary.durationSec)}
          </div>
        </div>

        <Button onClick={onClose} className="mt-6 h-12 w-full text-base font-semibold">
          Done
        </Button>
      </div>

      {/* local styles for confetti */}
      <style>{`
        @keyframes fallSpin {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .confetti-chip {
          animation-name: fallSpin;
          animation-timing-function: linear;
          animation-iteration-count: 1;
        }
      `}</style>
    </div>
  );
}