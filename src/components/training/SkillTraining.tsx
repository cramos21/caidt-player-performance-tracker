import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Timer, Zap } from "lucide-react";

interface SkillTrainingProps {
  onBack: () => void;
  onStartTraining: () => void;
}

const SkillTraining = ({ onBack, onStartTraining }: SkillTrainingProps) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Skill Training</h1>
      </div>

      {/* Training Overview */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Focused Skill Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Focused drills to improve technique. Perfect for developing ball control and accuracy.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Duration</span>
              </div>
              <p className="text-xs text-muted-foreground">30-45 minutes</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Intensity</span>
              </div>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Training focus:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• Ball control drills</div>
              <div>• Passing accuracy</div>
              <div>• First touch practice</div>
              <div>• Shooting technique</div>
            </div>
          </div>

          <Button 
            onClick={onStartTraining}
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
          >
            <Target className="w-5 h-5 mr-3" />
            Start Skill Training
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillTraining;