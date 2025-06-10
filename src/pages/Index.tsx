
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SoccerTrack Pro</h1>
            <p className="text-gray-600">Professional soccer performance tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isConnected ? 'Tracker Connected' : 'Not Connected'}
            </Badge>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && <ConnectTracker onConnect={() => setIsConnected(true)} />}

        {/* Live Session Controls */}
        {isConnected && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Training Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {!currentSession ? (
                  <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                    Start Session
                  </Button>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button onClick={stopSession} variant="destructive">
                      End Session
                    </Button>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{liveData.speed.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">{liveData.kicks} kicks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold">{Math.floor(liveData.duration / 60)}:{(liveData.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>
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
