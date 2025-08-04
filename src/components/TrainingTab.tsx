import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Target, Trophy, Timer, Activity } from "lucide-react";

interface TrainingTabProps {
  onStartTraining: () => void;
  isConnected: boolean;
  onTrainingTypeSelect: (type: string) => void;
}

const TrainingTab = ({ onStartTraining, isConnected, onTrainingTypeSelect }: TrainingTabProps) => {
  const trainingTypes = [
    {
      id: 'free-play',
      title: 'Free Play',
      description: 'Practice freely and track your movements',
      icon: Play,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'skill-training',
      title: 'Skill Training',
      description: 'Focused drills to improve technique',
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'endurance',
      title: 'Endurance Run',
      description: 'Build stamina with distance goals',
      icon: Timer,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'performance',
      title: 'Performance Test',
      description: 'Test your speed and agility',
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Training</h1>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {isConnected ? "Jump straight into training with your last session settings" : "Connect your tracker first to start training"}
          </p>
          {isConnected ? (
            <Button 
              onClick={onStartTraining}
              size="lg" 
              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
            >
              <Play className="w-5 h-5 mr-0.5" />
              Start Training Now
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold bg-muted text-muted-foreground cursor-not-allowed"
              disabled
            >
              <Play className="w-5 h-5 mr-0.5" />
              Connect Tracker First
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Training Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Training Types</h3>
        <div className="grid gap-4">
          {trainingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${type.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{type.title}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80"
                      onClick={() => onTrainingTypeSelect(type.id)}
                    >
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Goals */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <div className="font-medium text-foreground">Distance Goal</div>
              <div className="text-sm text-muted-foreground">Run 2.5km</div>
            </div>
            <div className="text-xs text-muted-foreground">0/2.5km</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <div className="font-medium text-foreground">Speed Target</div>
              <div className="text-sm text-muted-foreground">Beat 28.5 km/h</div>
            </div>
            <div className="text-xs text-muted-foreground">Best: 27.2 km/h</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingTab;