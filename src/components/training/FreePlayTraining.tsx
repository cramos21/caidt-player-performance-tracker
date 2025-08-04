import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Clock, Target } from "lucide-react";

interface FreePlayTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected?: boolean;
}

const FreePlayTraining = ({ onBack, onStartTraining, isConnected = false }: FreePlayTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Free Play</h1>
      </div>

      {/* Training Overview */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            Free Play Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Practice freely and track your movements. Perfect for warm-ups or casual training sessions.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-xs text-muted-foreground">No time limit</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Goals</span>
              </div>
              <p className="text-xs text-muted-foreground">Track all metrics</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">What you'll track:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Speed & Distance</div>
              <div>• Ball kicks</div>
              <div>• Session duration</div>
              <div>• Movement patterns</div>
            </div>
          </div>

          <Button 
            onClick={onStartTraining}
            size="lg" 
            className={`w-full h-14 text-lg font-bold ${isConnected ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            disabled={!isConnected}
          >
            <Play className="w-5 h-5 mr-1" />
            {isConnected ? 'Start Free Play' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreePlayTraining;