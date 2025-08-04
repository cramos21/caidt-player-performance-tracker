
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Target, MapPin, Clock, BarChart3 } from "lucide-react";

interface MetricsOverviewProps {
  liveData?: {
    speed: number;
    distance: number;
    kicks: number;
    duration: number;
  } | null;
}

const MetricsOverview = ({ liveData }: MetricsOverviewProps) => {
  // Mock historical data - in real app this would come from your database
  const historicalData = {
    avgSpeed: 18.5,
    maxSpeed: 32.1,
    totalDistance: 127.3,
    totalKicks: 1247,
    totalSessions: 23,
    weeklyGoal: 5
  };

  const currentSpeed = liveData?.speed || 0;
  const currentDistance = liveData?.distance || 0;
  const currentKicks = liveData?.kicks || 0;
  const sessionDuration = liveData?.duration || 0;

  const metrics = [
    {
      title: "Current Speed",
      value: liveData ? `${currentSpeed.toFixed(1)} km/h` : "0 km/h",
      description: `Avg: ${historicalData.avgSpeed} km/h`,
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      progress: Math.min((currentSpeed / historicalData.maxSpeed) * 100, 100)
    },
    {
      title: "Distance",
      value: liveData ? `${currentDistance.toFixed(2)} km` : `${historicalData.totalDistance} km`,
      description: liveData ? "This session" : "Total distance",
      icon: MapPin,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      progress: liveData ? Math.min((currentDistance / 5) * 100, 100) : 75
    },
    {
      title: "Kicks",
      value: liveData ? `${currentKicks}` : `${historicalData.totalKicks}`,
      description: liveData ? "This session" : "Total kicks",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      progress: liveData ? Math.min((currentKicks / 50) * 100, 100) : 85
    },
    {
      title: "Session Time",
      value: liveData ? `${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}` : `${historicalData.totalSessions} sessions`,
      description: liveData ? "Current session" : "This month",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      progress: liveData ? Math.min((sessionDuration / 3600) * 100, 100) : (historicalData.totalSessions / historicalData.weeklyGoal) * 20
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`relative overflow-hidden border ${metric.borderColor} bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300`}>
          <CardHeader className={`${metric.bgColor} pb-3`}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {metric.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {metric.description}
            </div>
            <Progress value={metric.progress} className="h-2" />
          </CardContent>
          {liveData && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
