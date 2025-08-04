import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Timer, Target } from "lucide-react";

interface PerformanceTabProps {
  liveData: any;
  currentSession: number | null;
}

const PerformanceTab = ({ liveData, currentSession }: PerformanceTabProps) => {
  const mockStats = {
    avgSpeed: 18.5,
    maxSpeed: 28.3,
    totalDistance: 45.2,
    sessions: 12
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-sm text-muted-foreground mt-2">Track your progress and analyze your game</p>
      </div>
      
      {/* Current Session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-xl font-bold">{liveData?.speed?.toFixed(1) || 0} km/h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-xl font-bold">{liveData?.distance?.toFixed(2) || 0} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kicks</p>
                <p className="text-xl font-bold">{liveData?.kicks || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-xl font-bold">
                  {Math.floor((liveData?.duration || 0) / 60)}:{((liveData?.duration || 0) % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Speed</p>
              <p className="text-xl font-bold">{mockStats.avgSpeed} km/h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Speed</p>
              <p className="text-xl font-bold">{mockStats.maxSpeed} km/h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Distance</p>
              <p className="text-xl font-bold">{mockStats.totalDistance} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-xl font-bold">{mockStats.sessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((session) => (
              <div key={session} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Training Session {session}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">25.3 km/h</p>
                  <p className="text-xs text-muted-foreground">45 min</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;