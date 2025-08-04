import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Zap, Target, Clock } from "lucide-react";

interface PerformanceTestProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected?: boolean;
}

const PerformanceTest = ({ onBack, onStartTraining, isConnected = false }: PerformanceTestProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Performance Test</h1>
      </div>

      {/* Training Overview */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            Performance Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Test your speed and agility. Measure your performance against previous records.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-xs text-muted-foreground">15-20 minutes</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Intensity</span>
              </div>
              <p className="text-xs text-muted-foreground">High</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Performance metrics:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Sprint speed test</div>
              <div>• Agility drills</div>
              <div>• Reaction time</div>
              <div>• Endurance bursts</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-600">
              💡 Your current best: 28.5 km/h max speed
            </p>
          </div>

          <Button 
            onClick={onStartTraining}
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
            disabled={!isConnected}
          >
            <Trophy className="w-5 h-5 mr-1" />
            {isConnected ? 'Start Performance Test' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTest;