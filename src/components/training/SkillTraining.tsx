import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Timer } from "lucide-react";

interface SkillTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
  isConnected: boolean;
}

const SkillTraining = ({ onBack, onStartTraining, isConnected }: SkillTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Skill Training</h1>
        <p className="text-sm text-muted-foreground mt-2">Focused skill development session</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">30-45 min</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Focus</p>
              <p className="font-semibold">Ball Control</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="font-medium text-blue-400 mb-2">Training Focus:</h3>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• First touch and ball control</li>
              <li>• Passing accuracy</li>
              <li>• Dribbling techniques</li>
              <li>• Shooting precision</li>
            </ul>
          </div>

          <Button 
            className="w-full" 
            onClick={onStartTraining}
            disabled={!isConnected}
            size="lg"
          >
            <Timer className="w-4 h-4 mr-2" />
            {isConnected ? 'Start Skill Training' : 'Connect Tracker First'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillTraining;