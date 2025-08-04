import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer, MapPin, TrendingUp } from "lucide-react";

interface EnduranceTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected?: boolean;
}

const EnduranceTraining = ({ onBack, onStartTraining, isConnected = false }: EnduranceTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Endurance Run</h1>
      </div>

      {/* Training Overview */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-orange-400" />
            Endurance Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Build stamina with distance goals. Improve your cardiovascular fitness and endurance.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium">Distance</span>
              </div>
              <p className="text-xs text-muted-foreground">5-10 km target</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Pace</span>
              </div>
              <p className="text-xs text-muted-foreground">Steady tempo</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Training benefits:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Cardiovascular fitness</div>
              <div>• Leg strength</div>
              <div>• Mental endurance</div>
              <div>• Recovery speed</div>
            </div>
          </div>

          <Button 
            onClick={onStartTraining}
            size="lg" 
            className={`w-full h-14 text-lg font-bold ${isConnected ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            disabled={!isConnected}
          >
            <Timer className="w-5 h-5 mr-0.5" />
            {isConnected ? 'Start Endurance Run' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnduranceTraining;