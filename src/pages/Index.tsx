
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import ConnectTracker from "@/components/ConnectTracker";
import PlayerProfile from "@/components/PlayerProfile";
import { Activity, Zap, Target, Timer, Settings, Trophy, TrendingUp } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // Player data - would come from your backend
  const [playerData, setPlayerData] = useState({
    name: "Alex Johnson",
    position: "Midfielder",
    team: "FC Thunder",
    avatar: "",
    level: "Pro",
    weeklyGoal: 5,
    currentStreak: 3
  });

  // Mock real-time data
  const [liveData, setLiveData] = useState({
    speed: 0,
    distance: 0,
    kicks: 0,
    duration: 0
  });

  // Today's summary stats
  const todayStats = {
    sessionsCompleted: currentSession ? 1 : 0,
    totalDistance: liveData.distance || 2.3,
    avgSpeed: 18.5,
    totalKicks: liveData.kicks || 34,
    caloriesBurned: 245
  };

  // Simulate live data updates when connected
  useEffect(() => {
    let interval;
    if (isConnected && currentSession) {
      interval = setInterval(() => {
        setLiveData(prev => ({
          speed: Math.random() * 25 + 5,
          distance: prev.distance + (Math.random() * 0.05),
          kicks: prev.kicks + (Math.random() > 0.7 ? 1 : 0),
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, currentSession]);

  const startSession = () => {
    setCurrentSession(Date.now());
    setLiveData({ speed: 0, distance: 0, kicks: 0, duration: 0 });
  };

  const stopSession = () => {
    setCurrentSession(null);
  };

  if (showProfile) {
    return <PlayerProfile playerData={playerData} setPlayerData={setPlayerData} onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mobile-container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        
        {/* Player Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={playerData.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {playerData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Welcome back, {playerData.name.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{playerData.position}</span>
                <span>•</span>
                <span>{playerData.team}</span>
                <Badge variant="secondary" className="ml-2">{playerData.level}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </Badge>
          </div>
        </div>

        {/* Today's Progress */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-primary" />
                Today's Progress
              </CardTitle>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="text-lg font-bold text-primary">{playerData.currentStreak} days</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{todayStats.sessionsCompleted}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{todayStats.totalDistance.toFixed(1)}km</div>
                <div className="text-xs text-muted-foreground">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{todayStats.avgSpeed}</div>
                <div className="text-xs text-muted-foreground">Avg Speed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{todayStats.totalKicks}</div>
                <div className="text-xs text-muted-foreground">Kicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{todayStats.caloriesBurned}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        {!isConnected && <ConnectTracker onConnect={() => setIsConnected(true)} />}

        {/* Live Session Controls */}
        {isConnected && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" />
                {currentSession ? 'Live Training Session' : 'Ready to Train'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!currentSession ? (
                  <Button 
                    onClick={startSession} 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 touch-target"
                    size="lg"
                  >
                    Start Training Session
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={stopSession} 
                        variant="destructive" 
                        className="touch-target"
                        size="lg"
                      >
                        End Session
                      </Button>
                      
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <div>
                            <div className="font-semibold text-foreground">{liveData.speed.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">km/h</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                          <Target className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-semibold text-foreground">{liveData.kicks}</div>
                            <div className="text-xs text-muted-foreground">kicks</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 col-span-2 sm:col-span-1">
                          <Timer className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="font-semibold text-foreground">
                              {Math.floor(liveData.duration / 60)}:{(liveData.duration % 60).toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-muted-foreground">time</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Overview */}
        <MetricsOverview liveData={currentSession ? liveData : null} />

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default Index;
