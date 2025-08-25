import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Target, MapPin, Clock } from "lucide-react";

interface MetricsOverviewProps {
  liveData?: {
    speed: number;
    distance: number; // km
    kicks: number;
    duration: number; // seconds
  } | null;
}

/** Saved at session-end (see Index.tsx) */
const SESSIONS_KEY = "pptracker:sessions";

type SavedSession = {
  at?: string;
  distanceKm?: number;
  kicks?: number;
  maxSpeed?: number;   // km/h
  durationSec?: number;
};

const TOP_SPEED_TARGET = 40; // just for the tiny progress bar visual

function loadSessions(): SavedSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const MetricsOverview = ({ liveData }: MetricsOverviewProps) => {
  const [sessions, setSessions] = useState<SavedSession[]>(loadSessions());

  // Refresh when new sessions are saved
  useEffect(() => {
    const onUpdate = () => setSessions(loadSessions());
    window.addEventListener("sessions-updated", onUpdate);
    return () => window.removeEventListener("sessions-updated", onUpdate);
  }, []);

  const totals = useMemo(() => {
    const totalDistance = sessions.reduce((s, x) => s + (x.distanceKm || 0), 0);
    const totalKicks = sessions.reduce((s, x) => s + (x.kicks || 0), 0);
    const fastestSpeed = sessions.reduce((m, x) => Math.max(m, x.maxSpeed || 0), 0);
    const avgTopSpeed =
      sessions.length > 0
        ? sessions.reduce((s, x) => s + (x.maxSpeed || 0), 0) / sessions.length
        : 0;

    return { totalDistance, totalKicks, fastestSpeed, avgTopSpeed, sessionCount: sessions.length };
  }, [sessions]);

  const currentDistance = liveData?.distance || 0;
  const currentKicks = liveData?.kicks || 0;
  const sessionDuration = liveData?.duration || 0;

  const metrics = [
    // 1) Fastest Speed — historical top (replaces Current Speed)
    {
      title: "Fastest Speed",
      value: `${totals.fastestSpeed.toFixed(1)} km/h`,
      description: `Avg top: ${totals.avgTopSpeed.toFixed(1)} km/h`,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      progress: Math.min((totals.fastestSpeed / TOP_SPEED_TARGET) * 100, 100),
      pulseWhenLive: false,
    },
    // 2) Distance
    {
      title: "Distance",
      value: liveData ? `${currentDistance.toFixed(2)} km` : `${totals.totalDistance.toFixed(1)} km`,
      description: liveData ? "This session" : "Total distance",
      icon: MapPin,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      progress: liveData ? Math.min((currentDistance / 5) * 100, 100) : 75,
      pulseWhenLive: true,
    },
    // 3) Kicks
    {
      title: "Kicks",
      value: liveData ? `${currentKicks}` : `${totals.totalKicks}`,
      description: liveData ? "This session" : "Total kicks",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      progress: liveData ? Math.min((currentKicks / 50) * 100, 100) : 85,
      pulseWhenLive: true,
    },
    // 4) Session time / count
    {
      title: "Session Time",
      value: liveData
        ? `${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, "0")}`
        : `${totals.sessionCount} sessions`,
      description: liveData ? "Current session" : "All time",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      progress: liveData
        ? Math.min((sessionDuration / 3600) * 100, 100)
        : Math.min((totals.sessionCount / 25) * 100, 100),
      pulseWhenLive: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border ${metric.borderColor} bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
        >
          <CardHeader className={`${metric.bgColor} pb-3`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {metric.value}
            </div>
            <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {metric.description}
            </div>
            <Progress value={metric.progress} className="h-2" />
          </CardContent>

          {liveData && metric.pulseWhenLive && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;