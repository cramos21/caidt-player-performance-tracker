import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ConnectTracker from "@/components/ConnectTracker";

import CountdownScreen from "@/components/CountdownScreen";
import LiveSessionTracking from "@/components/LiveSessionTracking";


import { useBluetooth } from "@/hooks/useBluetooth";
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
  const [lastSessionData, setLastSessionData] = useState<any>(null);
  
  const { isConnected: bluetoothConnected, trackerData } = useBluetooth();

  // Update parent state when bluetooth connection changes
  useEffect(() => {
    setIsConnected(bluetoothConnected);
  }, [bluetoothConnected, setIsConnected]);

  // Update live data when tracker data changes
  useEffect(() => {
    if (bluetoothConnected && trackerData) {
      setLiveData({
        speed: trackerData.speed,
        distance: trackerData.distance,
        kicks: trackerData.kicks,
        duration: trackerData.sessionTime * 60 // Convert minutes to seconds
      });
    }
  }, [trackerData, bluetoothConnected, setLiveData]);

  // Listen for start training event from other tabs
  useEffect(() => {
    const handleStartTraining = () => {
      if (bluetoothConnected) {
        startCountdown();
      }
    };
    
    window.addEventListener('start-training-countdown', handleStartTraining);
    return () => window.removeEventListener('start-training-countdown', handleStartTraining);
  }, [bluetoothConnected]);

  // Today's summary stats
  const todayStats = {
    sessionsCompleted: lastSessionData ? 1 : (currentSession ? 1 : 0),
    totalDistance: lastSessionData?.distance || liveData.distance || 2.3,
    avgSpeed: lastSessionData?.maxSpeed || 18.5,
    totalKicks: lastSessionData?.kicks || liveData.kicks || 34,
    caloriesBurned: lastSessionData ? Math.floor(lastSessionData.duration * 4.5) : 245
  };

  const startCountdown = () => {
    console.log("Starting countdown...");
    setShowCountdown(true);
    console.log("showCountdown set to true");
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowLiveSession(true);
    setCurrentSession(Date.now());
    
    // Reset live data and ensure we're getting real-time Arduino data
    setLiveData({ speed: 0, distance: 0, kicks: 0, sessionTime: 0 });
    
    // The useBluetooth hook should automatically start sending data updates
    console.log('🚀 Training session started - Arduino data should now flow in real-time');
  };

  const handleCountdownCancel = () => {
    setShowCountdown(false);
  };

  const handlePauseSession = () => {
    setIsPaused(!isPaused);
  };

  const handleEndSession = () => {
    // Save the session data before ending
    const sessionSummary = {
      ...liveData,
      maxSpeed: Math.max(25, liveData.speed), // Keep track of max speed achieved
      sessionDate: new Date().toISOString()
    };
    setLastSessionData(sessionSummary);
    
    setShowLiveSession(false);
    setCurrentSession(null);
    setIsPaused(false);
  };

  const handleBackFromLive = () => {
    setShowLiveSession(false);
    setCurrentSession(null);
    setIsPaused(false);
  };

  const handleTrackerConnect = () => {
    // Connection is handled by useBluetooth hook, just update UI
    console.log('Tracker connected via Bluetooth hook');
  };


  // Show countdown screen
  console.log("showCountdown:", showCountdown);
  if (showCountdown) {
    console.log("Rendering CountdownScreen");
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
      <div className="flex items-center justify-between pt-6">
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
              onClick={() => {
                // Navigate to account tab instead of showing profile overlay
                window.dispatchEvent(new CustomEvent('navigate-to-account'));
              }}
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
            <CardTitle className="flex items-center gap-2 text-xl">
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
            <div className="text-center p-3 rounded-lg bg-primary/10 hover:bg-primary/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{todayStats.sessionsCompleted}</div>
              <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Sessions</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">{todayStats.totalDistance.toFixed(1)}km</div>
              <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Distance</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-400/10 hover:bg-green-400/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">{todayStats.totalKicks}</div>
              <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Kicks</div>
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
            <Button variant="ghost" size="sm" onClick={() => {
              // Navigate to goals tab instead of showing goals overlay
              window.dispatchEvent(new CustomEvent('navigate-to-goals'));
            }}>
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

      {/* Connection Status - Show ConnectTracker when not connected, Training Start when connected */}
      {!isConnected ? (
        <ConnectTracker onConnect={handleTrackerConnect} />
      ) : (
        <Card className="border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/20 rounded-full">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Start Live Training Session</h3>
                <p className="text-sm text-muted-foreground">Your tracker is connected and ready to capture real-time performance data</p>
              </div>
              <Button 
                onClick={startCountdown}
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Live Training
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Tracker Connected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Real-time Data Ready</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardTab;
