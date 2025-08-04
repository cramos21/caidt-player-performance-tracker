import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Timer } from "lucide-react";

interface FreePlayTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected: boolean;
}

const FreePlayTraining = ({ onBack, onStartTraining, isConnected }: FreePlayTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Free Play</h1>
        <p className="text-sm text-muted-foreground mt-2">Casual training session with no specific goals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">No limit</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold">Free Play</p>
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">What to expect:</h3>
            <ul className="text-sm text-green-300 space-y-1">
              <li>• No time pressure or specific targets</li>
              <li>• Practice any skills you want</li>
              <li>• Track your performance metrics</li>
              <li>• Build confidence and muscle memory</li>
            </ul>
          </div>

          <Button 
            className="w-full" 
            onClick={onStartTraining}
            disabled={!isConnected}
            size="lg"
          >
            <Timer className="w-4 h-4 mr-2" />
            {isConnected ? 'Start Free Play' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreePlayTraining;