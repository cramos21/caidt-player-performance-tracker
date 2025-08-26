// src/pages/Index.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import PlayerProfile from "@/components/PlayerProfile";
import GoalsRewards from "@/components/GoalsRewards";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardTab from "@/components/DashboardTab";
import PerformanceTab from "@/components/PerformanceTab";
import TrainingTab from "@/components/TrainingTab";
import FreePlayTraining from "@/components/training/FreePlayTraining";
import SkillTraining from "@/components/training/SkillTraining";
import EnduranceTraining from "@/components/training/EnduranceTraining";
import PerformanceTest from "@/components/training/PerformanceTest";
import CountdownScreen from "@/components/CountdownScreen";
import LiveSessionTracking from "@/components/LiveSessionTracking";
import TrainingComplete from "../components/TrainingComplete";
import FullscreenOverlay from "@/components/FullscreenOverlay";
import { toast } from "sonner";

// Web-only information banner (safe on native; returns null there)
import WebDemoBanner from "@/components/WebDemoBanner";

// IMPORTANT: use our wrapper (native on iOS, stub on web)
import BluetoothLe from "@/capacitor/BluetoothLe";

/** ===== UUIDs (lowercased) ===== */
const TRACKER_SERVICE = "12345678-1234-1234-1234-123456789abc".toLowerCase();
const CHAR_KICKS      = "12345678-1234-1234-1234-123456789001".toLowerCase();
const CHAR_DIST       = "12345678-1234-1234-1234-123456789002".toLowerCase();
const CHAR_SPEED      = "12345678-1234-1234-1234-123456789003".toLowerCase();
const CHAR_TIME       = "12345678-1234-1234-1234-123456789004".toLowerCase(); // minutes; we tick seconds locally
const CHAR_CMD        = "12345678-1234-1234-1234-123456789005".toLowerCase(); // optional reset command

const LAST_DEVICE_KEY = "pptracker:lastDeviceId";
const SESSIONS_KEY    = "pptracker:sessions";

const getLastDeviceId = () => {
  try { return localStorage.getItem(LAST_DEVICE_KEY) || undefined; } catch { return undefined; }
};
const saveSession = (summary: any) => {
  try {
    const arr = JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]");
    arr.push(summary);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event("sessions-updated"));
  } catch {}
};

/** little-endian uint32 from hex/base64 */
function hexToUint32LE(hex?: string): number {
  if (!hex) return 0;
  const clean = hex.replace(/\s+/g, "").toLowerCase();
  const bytes = clean.match(/.{1,2}/g) ?? [];
  const le = bytes.slice(0, 4).reverse().join("");
  const n = parseInt(le || "0", 16);
  return Number.isFinite(n) ? n : 0;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  /** Overlays */
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const [showCountdown, setShowCountdown]   = useState(false);
  const [showLive, setShowLive]             = useState(false);
  const [showComplete, setShowComplete]     = useState(false);
  const [isPaused, setIsPaused]             = useState(false);
  const [lastSummary, setLastSummary]       = useState<null | {
    distanceKm: number; kicks: number; maxSpeed: number; durationSec: number;
  }>(null);

  /** Tabs & training */
  const [showProfile, setShowProfile]           = useState(false);
  const [showGoalsRewards, setShowGoalsRewards] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "performance" | "training" | "goals" | "account"
  >("dashboard");
  const [currentTrainingType, setCurrentTrainingType] = useState<string | null>(null);

  const [playerData, setPlayerData] = useState({
    name: "Alex Johnson",
    position: "Midfielder",
    team: "FC Thunder",
    avatar: "/src/assets/soccer-player-avatar.jpg", // 404 in web is cosmetic
    level: "Pro",
    weeklyGoal: 5,
    currentStreak: 3,
  });

  /** Live data during a session */
  const [liveData, setLiveData] = useState({
    speed: 0,      // km/h (one decimal)
    distance: 0,   // km (device sends meters; we convert)
    kicks: 0,
    sessionTime: 0 // seconds
  });

  const tickRef = useRef<any>(null);
  const lastConnectToastAt = useRef(0);

  /** Global bridges */
  useEffect(() => {
    const toAccount = () => setActiveTab("account");
    const toGoals   = () => setActiveTab("goals");
    const connected = () => {
      const now = Date.now();
      if (now - lastConnectToastAt.current > 1500) {
        lastConnectToastAt.current = now;
        toast.success("Your soccer tracker is connected");
      }
      setIsConnected(true);
    };
    const openCountdown = () => setShowCountdown(true);

    window.addEventListener("navigate-to-account", toAccount);
    window.addEventListener("navigate-to-goals", toGoals);
    window.addEventListener("tracker-connected", connected);
    window.addEventListener("start-training-countdown", openCountdown);

    return () => {
      window.removeEventListener("navigate-to-account", toAccount);
      window.removeEventListener("navigate-to-goals", toGoals);
      window.removeEventListener("tracker-connected", connected);
      window.removeEventListener("start-training-countdown", openCountdown);
    };
  }, []);

  /** Notifications → liveData */
  useEffect(() => {
    if (!currentSession) return;

    const onEvt = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      const charId = String(d.characteristic || "").toLowerCase();
      const hex = d.hex as string | undefined;
      if (!hex || !charId) return;
      const value = hexToUint32LE(hex);

      setLiveData(prev => {
        const next = { ...prev };
        if (charId.endsWith(CHAR_KICKS.slice(-4))) next.kicks    = value;
        else if (charId.endsWith(CHAR_DIST.slice(-4)))  next.distance = value / 1000;
        else if (charId.endsWith(CHAR_SPEED.slice(-4))) next.speed    = value / 10;
        return next;
      });
    };

    window.addEventListener("tracker-data", onEvt as EventListener);
    return () => window.removeEventListener("tracker-data", onEvt as EventListener);
  }, [currentSession]);

  /** Local seconds tick (pause-aware) */
  useEffect(() => {
    if (!showLive || !currentSession || isPaused) return;
    tickRef.current && clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setLiveData(prev => ({ ...prev, sessionTime: (prev.sessionTime ?? 0) + 1 }));
    }, 1000);
    return () => { tickRef.current && clearInterval(tickRef.current); };
  }, [showLive, currentSession, isPaused]);

  /** Poll device values every 1s as a backstop */
  useEffect(() => {
    if (!showLive || !currentSession || isPaused) return;

    let cancelled = false;

    const readChar = async (deviceId: string, ch: string) => {
      try {
        const res: any = await (BluetoothLe as any).read({ deviceId, service: TRACKER_SERVICE, characteristic: ch });
        return hexToUint32LE(res?.value || "");
      } catch {
        return undefined;
      }
    };

    const readAll = async () => {
      const deviceId = getLastDeviceId();
      if (!deviceId) return;

      const [kicks, distM, speed10] = await Promise.all([
        readChar(deviceId, CHAR_KICKS),
        readChar(deviceId, CHAR_DIST),
        readChar(deviceId, CHAR_SPEED),
      ]);
      if (cancelled) return;

      setLiveData(prev => ({
        ...prev,
        kicks:    kicks  ?? prev.kicks,
        distance: distM  !== undefined ? (distM / 1000) : prev.distance,
        speed:    speed10 !== undefined ? (speed10 / 10) : prev.speed,
      }));
    };

    readAll();
    const iv = setInterval(readAll, 1000);
    return () => { cancelled = true; clearInterval(iv); };
  }, [showLive, currentSession, isPaused]);

  /** Start training flow */
  const handleStartTraining = () => {
    if (!isConnected) {
      toast.error("Please connect your tracker first");
      return;
    }
    setLiveData({ speed: 0, distance: 0, kicks: 0, sessionTime: 0 });
    setShowCountdown(true);
  };

  /** Optional: send reset command (value=1) to Arduino */
  const resetArduinoSession = async () => {
    const deviceId = getLastDeviceId();
    if (!deviceId) return;
    const bytes = new Uint8Array([1]);
    try {
      await (BluetoothLe as any).write({ deviceId, service: TRACKER_SERVICE, characteristic: CHAR_CMD, value: bytes });
    } catch {
      try { await (BluetoothLe as any).writeWithoutResponse?.({ deviceId, service: TRACKER_SERVICE, characteristic: CHAR_CMD, value: bytes }); } catch {}
    }
  };

  /** Countdown callbacks */
  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    await resetArduinoSession(); // best-effort
    setIsPaused(false);
    setCurrentSession(Date.now());
    setShowLive(true);
  };
  const handleCountdownCancel = () => setShowCountdown(false);

  /** Live overlay callbacks */
  const handlePause = () => {
    setIsPaused(p => !p);
    toast.info(!isPaused ? "Training paused" : "Training resumed");
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsPaused(false);
    tickRef.current && clearInterval(tickRef.current);
  };

  const handleEnd  = () => {
    const summary = {
      at: new Date().toISOString(),
      distanceKm: liveData.distance || 0,
      kicks: liveData.kicks || 0,
      maxSpeed: liveData.speed || 0, // using last speed as fastest demo
      durationSec: liveData.sessionTime || 0,
    };
    saveSession(summary);
    setLastSummary({
      distanceKm: summary.distanceKm,
      kicks: summary.kicks,
      maxSpeed: summary.maxSpeed,
      durationSec: summary.durationSec,
    });
    stopSession();
    setShowLive(false);
    setShowComplete(true);
  };

  const handleBack = () => {
    stopSession();
    setShowLive(false);
  };

  /** Training screens */
  const trainingComponents = useMemo(() => ({
    "free-play": (
      <FreePlayTraining
        onBack={() => { setCurrentTrainingType(null); setActiveTab("training"); }}
        onStartTraining={handleStartTraining}
        isConnected={isConnected}
      />
    ),
    "skill-training": (
      <SkillTraining
        onBack={() => { setCurrentTrainingType(null); setActiveTab("training"); }}
        onStartTraining={handleStartTraining}
        isConnected={isConnected}
      />
    ),
    endurance: (
      <EnduranceTraining
        onBack={() => { setCurrentTrainingType(null); setActiveTab("training"); }}
        onStartTraining={handleStartTraining}
        isConnected={isConnected}
      />
    ),
    performance: (
      <PerformanceTest
        onBack={() => { setCurrentTrainingType(null); setActiveTab("training"); }}
        onStartTraining={handleStartTraining}
        isConnected={isConnected}
      />
    ),
  }), [handleStartTraining, isConnected]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            liveData={liveData}
            setLiveData={setLiveData}
            playerData={playerData}
            onShowProfile={() => setShowProfile(true)}
            goals={[
              { id: 1, title: "Weekly Training", target: playerData.weeklyGoal, current: 4, type: "sessions", reward: "Training Badge" },
              { id: 2, title: "Speed Goal", target: 30, current: 28.5, type: "speed", reward: "Speed Demon Badge" },
            ]}
            onShowGoals={() => setShowGoalsRewards(true)}
          />
        );
      case "performance": return <PerformanceTab liveData={liveData} currentSession={currentSession} />;
      case "training":    return <TrainingTab onStartTraining={handleStartTraining} isConnected={isConnected} onTrainingTypeSelect={setCurrentTrainingType} />;
      case "goals":       return <GoalsRewards goals={[
                              { id: 1, title: "Weekly Training", target: playerData.weeklyGoal, current: 4, type: "sessions", reward: "Training Badge" },
                              { id: 2, title: "Speed Goal", target: 30, current: 28.5, type: "speed", reward: "Speed Demon Badge" },
                            ]} setGoals={() => {}} />;
      case "account":     return <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />;
      default: return null;
    }
  };

  const hasOverlay = showCountdown || showLive || showComplete;

  /** Modal pages */
  if (showProfile || showGoalsRewards || currentTrainingType) {
    const Component = showProfile
      ? <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} />
      : showGoalsRewards
        ? <GoalsRewards goals={[
            { id: 1, title: "Weekly Training", target: playerData.weeklyGoal, current: 4, type: "sessions", reward: "Training Badge" },
            { id: 2, title: "Speed Goal", target: 30, current: 28.5, type: "speed", reward: "Speed Demon Badge" },
          ]} setGoals={() => {}} />
        : trainingComponents[currentTrainingType!];

    return (
      <div className="min-h-screen bg-gradient-to-br from-app-bg-from via-app-bg-via to-app-bg-to">
        <div className="px-4 pt-12 max-w-sm mx-auto pb-32">{Component}</div>
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab: string) =>
            setActiveTab(tab as "dashboard" | "performance" | "training" | "goals" | "account")
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg-from via-app-bg-via to-app-bg-to">
      <div className="px-4 pt-12 max-w-sm mx-auto pb-32">{renderTabContent()}</div>

      {!hasOverlay && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={(tab: string) =>
            setActiveTab(tab as "dashboard" | "performance" | "training" | "goals" | "account")
          }
        />
      )}

      {showCountdown && (
        <FullscreenOverlay>
          <CountdownScreen onCountdownComplete={handleCountdownComplete} onCancel={handleCountdownCancel} />
        </FullscreenOverlay>
      )}

      {showLive && (
        <FullscreenOverlay>
          <LiveSessionTracking
            liveData={liveData}
            isPaused={isPaused}
            onPause={handlePause}
            onEnd={handleEnd}
            onBack={handleBack}
            useOwnSafeArea={false}
          />
        </FullscreenOverlay>
      )}

      {showComplete && lastSummary && (
        <FullscreenOverlay>
          <TrainingComplete
            summary={lastSummary}
            onClose={() => setShowComplete(false)}
          />
        </FullscreenOverlay>
      )}

      {/* Web-only info banner (no-op on native) */}
      <WebDemoBanner />
    </div>
  );
};

export default Index;