import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConnectTracker from "@/components/ConnectTracker";
import CountdownScreen from "@/components/CountdownScreen";
import LiveSessionTracking from "@/components/LiveSessionTracking";
import { Activity, Zap, Target, Timer, Trophy, Camera } from "lucide-react";

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
  onShowGoals
}: DashboardTabProps) => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [showLiveSession, setShowLiveSession] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Today's summary stats
  const todayStats = {
    sessionsCompleted: currentSession ? 1 : 0,
    totalDistance: liveData.distance || 2.3,
    avgSpeed: 18.5,
    totalKicks: liveData.kicks || 34,
    caloriesBurned: 245
  };

  const startCountdown = () => {
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowLiveSession(true);
    setCurrentSession(Date.now());
    setLiveData({ speed: 0, distance: 0, kicks: 0, duration: 0 });
  };

  const handleCountdownCancel = () => {
    setShowCountdown(false);
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    setShowLiveSession(false);
    setCurrentSession(null);
    setIsPaused(false);
  };

  const handleBackFromLive = () => {
    setShowLiveSession(false);
    setCurrentSession(null);
    setIsPaused(false);
  };

  // Show countdown screen
  if (showCountdown) {
    return (
      <CountdownScreen
        onCountdownComplete={handleCountdownComplete}
        onCancel={handleCountdownCancel}
      />
    );
  }

  // Show live session tracking
  if (showLiveSession && currentSession) {
    return (
      <LiveSessionTracking
        liveData={liveData}
        onPause={handlePauseSession}
        onEndSession={handleEndSession}
        onBack={handleBackFromLive}
        isPaused={isPaused}
      />
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Mobile Player Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={playerData.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {playerData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute -bottom-1 -right-1 w-6 h-6 p-0 rounded-full"
              onClick={onShowProfile}
            >
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {playerData.name.split(' ')[0]}
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{playerData.position}</span>
              <span>•</span>
              <span>{playerData.team}</span>
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">{playerData.level}</Badge>
          </div>
        </div>
        <Badge 
          variant={isConnected ? "default" : "secondary"} 
          className="flex items-center gap-1 text-xs"
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span>{isConnected ? 'Connected' : 'Offline'}</span>
        </Badge>
      </div>

      {/* Today's Progress */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="w-4 h-4 text-primary" />
              Today's Progress
            </CardTitle>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-sm font-bold text-primary">{playerData.currentStreak} days</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-lg font-bold text-foreground">{todayStats.sessionsCompleted}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <div className="text-lg font-bold text-blue-400">{todayStats.totalDistance.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground">Distance</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-400/10">
              <div className="text-lg font-bold text-green-400">{todayStats.totalKicks}</div>
              <div className="text-xs text-muted-foreground">Kicks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Quick View */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-primary" />
              Goals & Rewards
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onShowGoals}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {goals.slice(0, 2).map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {goal.current}/{goal.target} {goal.type}
                </span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Connection Status */}
      {!isConnected && <ConnectTracker onConnect={() => setIsConnected(true)} />}

      {/* Live Session Controls */}
      {isConnected && (
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-4 h-4 text-primary" />
              {currentSession ? 'Live Training' : 'Ready to Train'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!currentSession ? (
                <Button 
                  onClick={startCountdown} 
                  className="w-full bg-primary hover:bg-primary/90 touch-target"
                  size="lg"
                >
                  Start Training Session
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setShowLiveSession(true)} 
                    className="w-full bg-primary hover:bg-primary/90 touch-target"
                    size="lg"
                  >
                    View Live Session
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">{liveData.speed.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">km/h</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                      <Target className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground text-sm">{liveData.kicks}</div>
                        <div className="text-xs text-muted-foreground">kicks</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500/10">
                    <Timer className="w-4 h-4 text-blue-400" />
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {Math.floor(liveData.duration / 60)}:{(liveData.duration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-muted-foreground">session time</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardTab;
