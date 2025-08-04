import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Trophy, Star } from "lucide-react";

interface GoalsRewardsProps {
  goals: any[];
  setGoals: (goals: any[]) => void;
}

const GoalsRewards = ({ goals }: GoalsRewardsProps) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="pt-6">
        <h1 className="text-2xl font-bold text-foreground">Goals & Rewards</h1>
        <p className="text-sm text-muted-foreground mt-2">Track your progress and earn rewards</p>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Badge variant={isCompleted ? "default" : "secondary"}>
                    {isCompleted ? "Completed" : `${Math.round(progress)}%`}
                  </Badge>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{goal.current}/{goal.target} {goal.type}</span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {goal.reward}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "First Training", description: "Complete your first training session", earned: true },
            { title: "Speed Demon", description: "Reach 25 km/h", earned: true },
            { title: "Consistent Player", description: "Train for 5 days in a row", earned: false }
          ].map((achievement, index) => (
            <div key={index} className={`p-3 rounded-lg border ${achievement.earned ? 'bg-primary/10 border-primary/20' : 'bg-muted/50 border-muted'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsRewards;