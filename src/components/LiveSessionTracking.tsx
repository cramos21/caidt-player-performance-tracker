// src/components/LiveSessionTracking.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, MapPin, Target } from "lucide-react";
import { toast } from "sonner";

type LiveData = {
  speed?: number;       // km/h
  distance?: number;    // raw distance (see DISTANCE_IS_METERS below)
  kicks?: number;
  sessionTime?: number; // seconds
};

interface Props {
  liveData: LiveData;
  isPaused: boolean;
  onPause: () => void;
  onEnd: () => void;
  onBack: () => void; // close overlay (does NOT end session)
  /** When the screen is embedded inside a page, add safe-area insets.
   * Our fullscreen overlay passes false so we don't double-pad. */
  useOwnSafeArea?: boolean;
}

/** 🔧 Distance units:
 * - If your Arduino publishes **meters**, set this to true to display km with decimals.
 * - If it publishes **kilometers**, leave as false.
 */
const DISTANCE_IS_METERS = false;

const LiveSessionTracking: React.FC<Props> = ({
  liveData,
  isPaused,
  onPause,
  onEnd,
  onBack,
  useOwnSafeArea = true,
}) => {
  // H:MM:SS
  const fmtTime = (secs?: number) => {
    const s = Math.max(0, Math.floor(secs ?? 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const distanceKm = (() => {
    const raw = liveData.distance ?? 0;
    return DISTANCE_IS_METERS ? raw / 1000 : raw;
  })();

  // Safe-area padding only when EMBEDDED (not overlay).
  const safeAreaStyles = useOwnSafeArea
    ? {
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
      }
    : undefined;

  const handlePauseClick = () => {
    const nextIsPaused = !isPaused;
    onPause();
    toast(nextIsPaused ? "Training paused" : "Training resumed", {
      description: nextIsPaused
        ? "Tap Resume when you’re ready."
        : "Live tracking is running.",
    });
  };

  const handleEndClick = () => {
    const ok = window.confirm("End session?\nYour current progress will be saved.");
    if (ok) onEnd();
  };

  return (
    <div className="h-full w-full select-none flex flex-col" style={safeAreaStyles}>
      {/* Scrollable content area so controls never get cut off */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto px-4 py-3">
          {/* Title (tightened spacing) */}
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Live Session</h1>

          {/* Stat cards — vertical on phones, 3-across on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="bg-white/5 border-white/10 min-w-0">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Speed</span>
                </div>
                <div className="mt-3 text-4xl font-extrabold text-foreground leading-none tracking-tight tabular-nums">
                  {(liveData.speed ?? 0).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">km/h</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 min-w-0">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Distance</span>
                </div>
                <div className="mt-3 text-4xl font-extrabold text-foreground leading-none tracking-tight tabular-nums">
                  {distanceKm.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">km</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 min-w-0">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Kicks</span>
                </div>
                <div className="mt-3 text-4xl font-extrabold text-foreground leading-none tracking-tight tabular-nums">
                  {liveData.kicks ?? 0}
                </div>
                <div className="text-xs text-muted-foreground mt-1">kicks</div>
              </CardContent>
            </Card>
          </div>

          {/* Timer (reduced top margin) */}
          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground mb-1">Time</div>
            <div className="text-5xl font-extrabold text-foreground leading-none tracking-tight tabular-nums">
              {fmtTime(liveData.sessionTime)}
            </div>
          </div>

          {/* Controls (reduced vertical spacing) */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button onClick={handlePauseClick} variant="secondary" className="h-12 text-base font-semibold">
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              onClick={handleEndClick}
              className="h-12 text-base font-semibold bg-red-600 hover:bg-red-600/90"
            >
              End
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel pinned to the bottom (always visible) */}
      <div className="w-full text-center">
        <div
          className="w-full"
          style={{
            paddingBottom: useOwnSafeArea
              ? "calc(env(safe-area-inset-bottom, 0px) + 12px)"
              : "12px",
          }}
        >
          <Button onClick={onBack} variant="ghost" className="text-muted-foreground hover:text-foreground">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionTracking;