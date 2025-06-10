
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MetricsOverview from "@/components/MetricsOverview";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import ConnectTracker from "@/components/ConnectTracker";
import { Activity, Zap, Target, Timer } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  // Mock real-time data
  const [liveData, setLiveData] = useState({
    speed: 0,
    distance: 0,
    kicks: 0,
    duration: 0
  });

  // Simulate live data updates when connected
  useEffect(() => {
    let interval;
    if (isConnected && currentSession) {
      interval = setInterval(() => {
        setLiveData(prev => ({
          speed: Math.random() * 25 + 5, // 5-30 km/h
          distance: prev.distance + (Math.random() * 0.05), // incremental distance
          kicks: prev.kicks + (Math.random() > 0.7 ? 1 : 0), // random kicks
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="mobile-container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">SoccerTrack Pro</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Professional soccer performance tracking</p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className="flex items-center gap-2 touch-target px-4 py-2"
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs sm:text-sm">
                {isConnected ? 'Tracker Connected' : 'Not Connected'}
              </span>
            </Badge>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && <ConnectTracker onConnect={() => setIsConnected(true)} />}

        {/* Live Session Controls - Mobile Optimized */}
        {isConnected && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" />
                Training Session
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
                    Start Session
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={stopSession} 
                      variant="destructive" 
                      className="w-full sm:w-auto touch-target"
                      size="lg"
                    >
                      End Session
                    </Button>
                    
                    {/* Live metrics - Mobile grid */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-sm">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-foreground">{liveData.speed.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">{liveData.kicks} kicks</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 col-span-2 sm:col-span-1">
                        <Timer className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-foreground">
                          {Math.floor(liveData.duration / 60)}:{(liveData.duration % 60).toString().padStart(2, '0')}
                        </span>
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
