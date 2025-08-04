import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Square, Timer, Zap, MapPin, Target } from "lucide-react";

interface LiveSessionTrackingProps {
  liveData: any;
  onPause: () => void;
  onEndSession: () => void;
  onBack: () => void;
  isPaused?: boolean;
}

const LiveSessionTracking = ({ liveData, onPause, onEndSession, onBack, isPaused = false }: LiveSessionTrackingProps) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Live Session</h1>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-sm text-muted-foreground">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
          </div>
        </div>

        {/* Timer Display */}
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6 text-center">
            <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-4xl font-bold text-primary">{formatTime(duration)}</div>
            <div className="text-sm text-muted-foreground">Session Time</div>
          </CardContent>
        </Card>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4 text-center">
              <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{liveData?.speed?.toFixed(1) || '0.0'}</div>
              <div className="text-xs text-muted-foreground">km/h</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4 text-center">
              <MapPin className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{liveData?.distance?.toFixed(2) || '0.00'}</div>
              <div className="text-xs text-muted-foreground">km</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{liveData?.kicks || 0}</div>
              <div className="text-xs text-muted-foreground">Kicks</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4 text-center">
              <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{Math.round(Math.random() * 150 + 120)}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </CardContent>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={onPause}
            variant={isPaused ? "default" : "secondary"}
            size="lg" 
            className="w-full"
          >
            <Pause className="w-5 h-5 mr-0.5" />
            {isPaused ? 'Resume' : 'Pause'} Session
          </Button>
          
          <Button 
            onClick={onEndSession}
            variant="destructive" 
            size="lg" 
            className="w-full"
          >
            <Square className="w-5 h-5 mr-0.5" />
            End Session
          </Button>

          <Button 
            onClick={onBack}
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionTracking;