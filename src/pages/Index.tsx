
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
import GoalsRewards from "@/components/GoalsRewards";
import { Activity, Zap, Target, Timer, Settings, Trophy, TrendingUp, Camera } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showGoalsRewards, setShowGoalsRewards] = useState(false);
  
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

  // Mock goals data
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Weekly Training",
      target: playerData.weeklyGoal,
      current: 4,
      type: "sessions",
      reward: "Training Badge"
    },
    {
      id: 2,
      title: "Speed Goal",
      target: 30,
      current: 28.5,
      type: "speed",
      reward: "Speed Demon Badge"
    },
    {
      id: 3,
      title: "Distance Challenge",
      target: 50,
      current: 32.8,
      type: "distance",
      reward: "Marathon Runner"
    }
  ]);

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

  if (showGoalsRewards) {
    return <GoalsRewards goals={goals} setGoals={setGoals} onBack={() => setShowGoalsRewards(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="safe-area-inset px-4 py-6 space-y-6 max-w-sm mx-auto">
        
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
                onClick={() => setShowProfile(true)}
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
          <div className="flex flex-col items-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className="flex items-center gap-1 text-xs"
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
              <span>{isConnected ? 'Connected' : 'Offline'}</span>
            </Badge>
          </div>
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
              <Button variant="ghost" size="sm" onClick={() => setShowGoalsRewards(true)}>
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
                    onClick={startSession} 
                    className="w-full bg-primary hover:bg-primary/90 touch-target"
                    size="lg"
                  >
                    Start Training Session
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={stopSession} 
                      variant="destructive" 
                      className="w-full touch-target"
                      size="lg"
                    >
                      End Session
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

        {/* Metrics Overview - Mobile Optimized */}
        <MetricsOverview liveData={currentSession ? liveData : null} />

        {/* Performance Chart - Mobile Optimized */}
        <PerformanceChart />

        {/* Recent Activity - Mobile Optimized */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default Index;
