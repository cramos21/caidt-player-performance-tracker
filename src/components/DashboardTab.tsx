import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConnectTracker from "@/components/ConnectTracker";
import { useBluetooth } from "@/hooks/useBluetooth";
import { mapToDashboardStats } from "@/utils/dataMapping";
import { Activity, Target, Trophy, Camera, Zap } from "lucide-react";

interface DashboardTabProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  currentSession: number | null;
  setCurrentSession: (session: number | null) => void;
  liveData: any;
  setLiveData: (data: any) => void;
  playerData: any;
  onShowProfile: () => void;
  goals: any[];
  onShowGoals: () => void;
}

const DashboardTab = ({
  isConnected,
  setIsConnected,
  currentSession,
  setCurrentSession,
  liveData,
  setLiveData,
  playerData,
  onShowProfile,
  goals,
  onShowGoals,
}: DashboardTabProps) => {
  const { isConnected: bluetoothConnected, connectQuick } = useBluetooth();

  // keep connection pill in sync with BLE hook
  useEffect(() => {
    setIsConnected(bluetoothConnected);
  }, [bluetoothConnected, setIsConnected]);

  const todayStats = mapToDashboardStats(liveData || {}, null, !!currentSession);

  const hasGoals = Array.isArray(goals) && goals.length > 0;

  const startViaOverlay = () => {
    // Index.tsx listens for this and opens Countdown -> Live overlays
    window.dispatchEvent(new Event("start-training-countdown"));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={playerData.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {playerData.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-1 -right-1 w-6 h-6 p-0 rounded-full"
              onClick={() => window.dispatchEvent(new CustomEvent("navigate-to-account"))}
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          <div>
            <h1 className="text/lg font-bold text-foreground">
              {playerData.name.split(" ")[0]}
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{playerData.position}</span>
              <span>•</span>
              <span>{playerData.team}</span>
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {playerData.level}
            </Badge>
          </div>
        </div>
        <Badge
          variant={isConnected ? "default" : "secondary"}
          className="flex items-center gap-1 text-xs bg-emerald-500/25 border-emerald-500/30"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-primary animate-pulse" : "bg-muted-foreground"
            }`}
          />
          <span>{isConnected ? "Connected" : "Offline"}</span>
        </Badge>
      </div>

      {/* Today's Progress */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="w-4 h-4 text-primary" />
              Today&apos;s Progress
            </CardTitle>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-sm font-bold text-primary">
                {playerData.currentStreak} days
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-lg font-bold">{todayStats.sessionsCompleted}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <div className="text-lg font-bold text-blue-400">
                {(todayStats.totalDistance ?? 0).toFixed(1)}km
              </div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-400/10">
              <div className="text-lg font-bold text-green-400">
                {todayStats.totalKicks ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">Kicks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Quick View */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-4 h-4 text-primary" />
              Goals & Rewards
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => window.dispatchEvent(new CustomEvent("navigate-to-goals"))}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasGoals ? (
            goals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {goal.current}/{goal.target} {goal.type}
                  </span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (Number(goal.current || 0) / Number(goal.target || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No goals yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Connection / Start Session */}
      {!isConnected ? (
        <ConnectTracker onConnect={connectQuick} />
      ) : (
        <Card className="border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/20 rounded-full">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Start Live Training Session</h3>
                <p className="text-sm text-muted-foreground">
                  Your tracker is connected and ready to capture real-time performance data
                </p>
              </div>
              <Button
                onClick={startViaOverlay}
                size="lg"
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardTab;