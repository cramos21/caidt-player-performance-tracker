import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Timer } from "lucide-react";

interface EnduranceTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected: boolean;
}

const EnduranceTraining = ({ onBack, onStartTraining, isConnected }: EnduranceTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Endurance Training</h1>
        <p className="text-sm text-muted-foreground mt-2">Build stamina and cardiovascular fitness</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">45-60 min</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Intensity</p>
              <p className="font-semibold">Moderate</p>
            </div>
          </div>
          
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <h3 className="font-medium text-orange-400 mb-2">Training Plan:</h3>
            <ul className="text-sm text-orange-300 space-y-1">
              <li>• Continuous running with ball</li>
              <li>• Interval sprints</li>
              <li>• Agility ladder drills</li>
              <li>• Recovery and stretching</li>
            </ul>
          </div>

          <Button 
            className="w-full" 
            onClick={onStartTraining}
            disabled={!isConnected}
            size="lg"
          >
            <Timer className="w-4 h-4 mr-2" />
            {isConnected ? 'Start Endurance Training' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnduranceTraining;