import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Activity, Target } from "lucide-react";

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
  playerData,
  goals,
  onShowGoals 
}: DashboardTabProps) => {
  const handleConnect = () => {
    setIsConnected(true);
    setCurrentSession(Date.now());
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCurrentSession(null);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-2">Welcome back, {playerData.name}</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Tracker Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button 
              onClick={isConnected ? handleDisconnect : handleConnect}
              variant={isConnected ? "destructive" : "default"}
              size="sm"
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Data */}
      {isConnected && currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Live Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-lg font-semibold">{liveData.speed.toFixed(1)} km/h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-lg font-semibold">{liveData.distance.toFixed(2)} km</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kicks</p>
                <p className="text-lg font-semibold">{liveData.kicks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{Math.floor(liveData.duration / 60)}:{(liveData.duration % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Goals Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{goal.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {goal.current}/{goal.target} {goal.type}
                  </p>
                </div>
                <Badge variant="secondary">
                  {Math.round((goal.current / goal.target) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3"
            onClick={onShowGoals}
          >
            View All Goals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;