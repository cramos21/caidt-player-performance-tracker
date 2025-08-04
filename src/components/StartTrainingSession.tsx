import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Target, Trophy } from "lucide-react";

interface StartTrainingSessionProps {
  onStartCountdown: () => void;
  onBack: () => void;
}

const StartTrainingSession = ({ onStartCountdown, onBack }: StartTrainingSessionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Play className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Ready to Train?</h1>
          <p className="text-muted-foreground">
            Your tracker is connected and ready. Time to show what you've got!
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Today's Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Distance Goal</div>
                <div className="text-sm text-muted-foreground">Run 2.5km during training</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Speed Challenge</div>
                <div className="text-sm text-muted-foreground">Beat your top speed of 28.5 km/h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={onStartCountdown}
            size="lg" 
            className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90"
          >
            <Play className="w-6 h-6 mr-0.5" />
            Start Training Session
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

export default StartTrainingSession;