import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Target, Clock, Zap } from "lucide-react";

interface TrainingTabProps {
  onStartTraining: () => void;
  isConnected: boolean;
  onTrainingTypeSelect: (type: string) => void;
}

const TrainingTab = ({ isConnected, onTrainingTypeSelect }: TrainingTabProps) => {
  const trainingTypes = [
    {
      id: 'free-play',
      title: 'Free Play',
      description: 'Casual training session',
      icon: Play,
      color: 'bg-green-500/20 text-green-500'
    },
    {
      id: 'skill-training',
      title: 'Skill Training',
      description: 'Focused skill development',
      icon: Target,
      color: 'bg-blue-500/20 text-blue-500'
    },
    {
      id: 'endurance',
      title: 'Endurance',
      description: 'Build stamina and endurance',
      icon: Clock,
      color: 'bg-orange-500/20 text-orange-500'
    },
    {
      id: 'performance',
      title: 'Performance Test',
      description: 'Measure your capabilities',
      icon: Zap,
      color: 'bg-purple-500/20 text-purple-500'
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Training</h1>
        <p className="text-sm text-muted-foreground mt-2">Choose your training type</p>
      </div>

      <div className="grid gap-4">
        {trainingTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{type.title}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {type.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={() => onTrainingTypeSelect(type.id)}
                  disabled={!isConnected}
                >
                  {isConnected ? 'Start Training' : 'Connect Tracker First'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isConnected && (
        <Card className="border-orange-500/20 bg-orange-500/10">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-400 text-center">
              Connect your tracker from the Dashboard to start training
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingTab;