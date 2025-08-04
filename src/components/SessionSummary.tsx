import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, MapPin, Zap, Target, Star, ArrowRight } from "lucide-react";

interface SessionSummaryProps {
  sessionData: {
    duration: number;
    distance: number;
    maxSpeed: number;
    kicks: number;
    averageSpeed: number;
    personalBests?: string[];
  };
  onViewPerformance: () => void;
  onNewSession: () => void;
  onBackToDashboard: () => void;
}

const SessionSummary = ({ sessionData, onViewPerformance, onNewSession, onBackToDashboard }: SessionSummaryProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const hasPersonalBests = sessionData.personalBests && sessionData.personalBests.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          {hasPersonalBests && (
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {hasPersonalBests ? 'New Personal Best!' : 'Session Complete'}
            </h1>
            <p className="text-muted-foreground">
              {hasPersonalBests ? 'You smashed your previous records!' : 'Great job on your training session'}
            </p>
          </div>
        </div>

        {/* Personal Bests */}
        {hasPersonalBests && (
          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-yellow-500 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Personal Bests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionData.personalBests?.map((best, index) => (
                <Badge key={index} variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  {best}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Session Stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Session Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-4 text-center">
                <Timer className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl font-bold text-foreground group-hover:text-blue-400 transition-colors duration-300">{formatTime(sessionData.duration)}</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Duration</div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-4 text-center">
                <MapPin className="w-6 h-6 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl font-bold text-foreground group-hover:text-green-400 transition-colors duration-300">{sessionData.distance.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">km</div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-4 text-center">
                <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl font-bold text-foreground group-hover:text-orange-400 transition-colors duration-300">{sessionData.maxSpeed.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">km/h max</div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-4 text-center">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors duration-300">{sessionData.kicks}</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Kicks</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm hover:bg-card hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{sessionData.averageSpeed.toFixed(1)} km/h</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Average Speed</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            onClick={onViewPerformance}
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90"
          >
            View Performance Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button 
            onClick={onNewSession}
            variant="secondary" 
            size="lg" 
            className="w-full"
          >
            Start New Session
          </Button>

          <Button 
            onClick={onBackToDashboard}
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

export default SessionSummary;